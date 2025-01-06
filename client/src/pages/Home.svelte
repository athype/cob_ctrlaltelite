<script>
    import AudioRecorder from "../components/AudioRecorder.svelte";
    import VideoRecorder from "../components/VideoRecorder.svelte";
    import {onMount} from "svelte";
    import List from "../components/List.svelte";
    import TitleInputField from "../components/TitleInputField.svelte";
    import TranscriptionDisplay from "../components/TranscriptionDisplay.svelte";

    // Declare reactive variables
    let feedbackText = $state('');
    let recordings = $state([]);
    let texts = $state([]);
    let selectedFeedback = $state(null);
    let textFeedbackTitle = $state('');
    let showTranscription = $state(false);

    // Side effect that runs whenever a reactive variable changes, also polling backend for feedback every 5 seconds.
    $effect(() => {
        fetchFeedback();
    });

    /**
     * Fetches both audio and text feedback from backend api via await.
     */
    async function fetchFeedback() {
        try {
            // Fetch audio feedback
            const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
            if (recordingsResponse.ok) {
                recordings = await recordingsResponse.json();
            } else if (recordingsResponse.status === 404) {
                console.warn('No audio feedback found.');
                recordings = [];
            } else {
                console.error('Failed to fetch audio feedback:', await recordingsResponse.text());
            }

            // Fetch text feedback
            const textsResponse = await fetch('http://localhost:3000/text-feedback');
            if (textsResponse.ok) {
                texts = await textsResponse.json();
            } else {
                console.error('Failed to fetch text feedback:', await textsResponse.text());
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    }


    /**
     * When an audio feedback is clicked, selected feedback is updated with its data.
     * @param recording
     */
    function handleAudioFeedbackClick(recording) {
        showTranscription = false;
        selectedFeedback = {
            id: recording.id,
            type: 'audio',
            filePath: recording.file_path,
            name: `Audio Feedback ${recording.name}`
        };
    }

    /**
     * When text feedback button is clicked, selected feedback is updated with its data.
     * @param text
     */
    function handleTextFeedbackClick(text) {
        selectedFeedback = {
            type: 'text',
            id: text.id,
            content: text.feedback_text,
            name: `Text Feedback ${text.name}`
        };
    }

    /**
     * Helper function for determining if an audio is selected.
     * @param recording
     */
    function isAudioFeedbackSelected(recording) {
        return selectedFeedback?.type === 'audio' && selectedFeedback?.id === recording.id;
    }

    /**
     * Helper function for determining if a text is selected.
     * @param text
     */
    function isTextFeedbackSelected(text) {
        return selectedFeedback?.type === 'text' && selectedFeedback?.id === text.id;
    }

    /**
     * Sends text feedback to the db.
     * @param text_feedback
     */
    async function saveTextFeedback(text_feedback) {
        try {
            const response = await fetch('http://localhost:3000/text_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback_text: text_feedback,
                name: textFeedbackTitle}),
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Text feedback saved successfully:', result);
                feedbackText = '';
                textFeedbackTitle = '';
                await fetchFeedback();
            } else {
                console.error('Failed to save text:', await response.text());
            }
        } catch (error) {
            console.error('Error saving text:', error);
        }
    }

    /**
     * Handler function that calls save function.
     */
    function handleSend() {
        saveTextFeedback(feedbackText);
    }

    async function handleTranscriptionClick() {
        showTranscription = true;
    }

</script>

<main class="container">
    <h1>Feedbacks</h1>
    <section class="feedback-sections">

        <List
                items={texts}
                labelPrefix="Text"
                handleClick={handleTextFeedbackClick}
                isSelected={isTextFeedbackSelected}
        />

        <List
                items={recordings}
                labelPrefix="Audio"
                handleClick={handleAudioFeedbackClick}
                isSelected={isAudioFeedbackSelected}
        />

    </section>

    <section class="selected-feedback-display">
        {#if selectedFeedback}
            <div class="feedback-header">{selectedFeedback.name}</div>
            {#if selectedFeedback.type === 'audio'}
                {#key selectedFeedback.id}
                    <audio controls autoplay>
                        <source src="http://localhost:3000/{selectedFeedback.filePath}" type="audio/wav"/>
                        Your browser does not support the audio element.
                    </audio>
                    <button on:click={handleTranscriptionClick} class="send-button">Transcribe</button>
                    {#if showTranscription}
                        <TranscriptionDisplay id={selectedFeedback.id}/>
                    {/if}
                {/key}
            {:else if selectedFeedback.type === 'text'}
                <p>{selectedFeedback.content}</p>
            {/if}
        {:else}
            <p style="text-align: center; padding-bottom: 5vh">Select a feedback to view it here.</p>
        {/if}
    </section>

    <h1>Add Feedback</h1>
    <section class="feedback-input">
        <TitleInputField  bind:title={textFeedbackTitle}/>
        <textarea bind:value={feedbackText} placeholder="Type your feedback here..." rows="3"></textarea>
        <button on:click={handleSend} class="send-button">Save Text Feedback</button>
        <AudioRecorder onRecordingSaved={fetchFeedback} />
        <VideoRecorder/>
    </section>
</main>


<style>

    /* main container*/
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
    }

    .container h1 {
        font-size: 1.75rem;
        margin-top: 3vh;

    }

    header h2 {
        color: white;
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }

    .feedback-sections {
        display: flex;
        gap: 2rem;
    }

    .selected-feedback-display {
        position: relative;
        background-color: #2c2c2c;
        padding: 4rem 1rem 1rem;
        border-radius: 0.5rem;
        border-top: 0.1rem solid var(--clr-pink);
        color: white;
        font-size: 1.5rem;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 50vh;
        overflow-y: auto;
        word-wrap: break-word;
    }

    /* scroll bar css to be deleted later after list component maybe */
    .selected-feedback-display::-webkit-scrollbar,
    textarea::-webkit-scrollbar {
        width: 0.1rem;
    }

    .selected-feedback-display::-webkit-scrollbar-thumb,
    textarea::-webkit-scrollbar-thumb {
        background: var(--clr-purple);
        border-radius: 0.5rem;
    }


    .feedback-header {
        position: absolute;
        top: 0.625rem;
        left: 0.625rem;
        font-size: 1rem;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        border-radius: 0.25rem;
        color: white;
    }

    .feedback-input {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 2rem;
    }


    .send-button {
        background-color: var(--clr-pink);
        color: #101010;
        padding: 1rem;
        width: 20rem;
        align-self: center;
        border-radius: 0.625rem;
    }

    .send-button:hover {
        box-shadow: 0 0 0.3125rem 0.0625rem #9400FF;
        color: white;
    }


    textarea {
        padding: 1rem;
        min-height: 10vh;
        border-radius: 4px;
        background-color: #353535;
        color: #ffffff;
        border: 0 solid darkgrey;
        border-top-width: 1px;
    }

    audio {
        width: 100%;
    }
</style>