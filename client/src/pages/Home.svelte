<script>
    import AudioRecorder from "../components/AudioRecorder.svelte";
    import FeedbackButton from "../components/FeedbackButton.svelte";
    import { onMount } from "svelte";

    let feedbackText = '';
    let recordings = [];
    let texts = [];
    let selectedFeedback = null;

    // Fetch recordings and text feedback from the backend
    async function fetchFeedback() {
        try {
            // Fetch audio feedback
            const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
            if (recordingsResponse.ok) {
                recordings = await recordingsResponse.json();
            } else if (recordingsResponse.status === 404) {
                console.warn('No audio feedback found.');
                recordings = []; // Set an empty array to avoid errors
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


    // Function for on click of audio feedback button
    function handleAudioFeedbackClick(recording) {
        selectedFeedback = {
            id: recording.id,
            type: 'audio',
            filePath: recording.file_path,
            name: `Audio Feedback ${recording.id}`
        };
    }

    // Function for on click of text feedback button
    function handleTextFeedbackClick(text) {
        selectedFeedback = {
            type: 'text',
            content: text.feedback_text,
            name: `Text Feedback ${text.id}`
        };
    }

    async function saveTextFeedback(text_feedback) {
        try {
            const response = await fetch('http://localhost:3000/text_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback_text: text_feedback }),
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Text feedback saved successfully:', result);
                feedbackText = '';
                await fetchFeedback();
            } else {
                console.error('Failed to save text:', await response.text());
            }
        } catch (error) {
            console.error('Error saving text:', error);
        }
    }


    function handleSend() {
        saveTextFeedback(feedbackText);
    }

    onMount(fetchFeedback);
</script>

<main class="container">
    <h1>Feedbacks</h1>
    <section class="feedback-sections">
        <section class="texts">
            <header>
                <h2>Texts</h2>
            </header>
            {#if texts.length > 0}
                {#each texts as text}
                    <FeedbackButton
                            label={`Text Feedback ${text.id}`}
                            onClick={() => handleTextFeedbackClick(text)}
                            selected={selectedFeedback?.content === text.feedback_text && selectedFeedback?.type === 'text'}
                    />
                {/each}
            {:else}
                <p>No text feedback available.</p>
            {/if}
        </section>

        <section class="recordings">
            <header>
                <h2>Recordings</h2>
            </header>
            {#if recordings.length > 0}
                {#each recordings as recording}
                    <FeedbackButton
                            label={`Audio Feedback ${recording.id}`}
                            onClick={() => handleAudioFeedbackClick(recording)}
                            selected={selectedFeedback?.id === recording.id && selectedFeedback?.type === 'audio'}
                    />
                {/each}
            {:else}
                <p>No recordings available.</p>
            {/if}
        </section>
    </section>

    <section class="selected-feedback-display">
        {#if selectedFeedback}
            <div class="feedback-header">{selectedFeedback.name}</div>
            {#if selectedFeedback.type === 'audio'}
                {#key selectedFeedback.id}
                    <audio controls autoplay>
                        <source src="http://localhost:3000/{selectedFeedback.filePath}" type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
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
        <AudioRecorder />
        <textarea bind:value={feedbackText} placeholder="Type your feedback here..." rows="3"></textarea>
        <button on:click={handleSend} class="send-button">Save Text Feedback</button>
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

    /* recordings and texts */
    .recordings, .texts {
        flex: 1;
        background-color: #2c2c2c;
        padding: 1rem;
        border-radius: 8px;
        border: 2px solid var(--clr-purple);
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
        overflow-y: auto;
        max-height: 300px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .recordings button, .texts button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: var(--clr-purple);
        color: black;
        font-size: 1rem;
        width: 100%;
    }
    .recordings button:hover, .texts button:hover {
        box-shadow: 0 0 5px 1px #9400FF;
        color: white;
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
        width: 8px;
    }
    .selected-feedback-display::-webkit-scrollbar-thumb,
    textarea::-webkit-scrollbar-thumb {
        background: var(--clr-purple);
        border-radius: 4px;
    }


    .feedback-header {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 1rem;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        border-radius: 4px;
        color: white;
    }

    .feedback-input {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 2rem;
    }




    .send-button{
        background-color: var(--clr-pink);
        color: #101010;
        padding: 1rem;
        width: 20rem;
        align-self: center;
        border-radius: 10px;
    }
    .send-button:hover{
        box-shadow: 0 0 5px 1px #9400FF;
        color: white;
    }


    textarea {
        padding: 1rem;
        min-height: 10vh;
        border-radius: 4px;
        border: 1px solid darkgrey;
        background-color: #353535;
        color: #ffffff;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
    }

    audio {
        width:100%;
    }


</style>