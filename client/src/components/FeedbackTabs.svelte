<script>
    import List from "./List.svelte";
    import FeedbackButton from "./FeedbackButton.svelte";
    import TranscriptionDisplay from "./TranscriptionDisplay.svelte";
    let recordings = $state([]);
    let texts = $state([]);
    let selectedFeedback = $state(null);
    let showTranscription = $state(false);

    $effect(() => {
        fetchFeedback();
    });

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

    function handleTextFeedbackClick(text) {
        selectedFeedback = {
            type: 'text',
            id: text.id,
            content: text.feedback_text,
            name: `Text Feedback ${text.name}`
        };
    }

    function isTextFeedbackSelected(text) {
        return selectedFeedback?.type === 'text' && selectedFeedback?.id === text.id;
    }

    function handleAudioFeedbackClick(recording) {
        showTranscription = false;
        selectedFeedback = {
            id: recording.id,
            type: 'audio',
            filePath: recording.file_path,
            name: `Audio Feedback ${recording.name}`
        };
    }

    function isAudioFeedbackSelected(recording) {
        return selectedFeedback?.type === 'audio' && selectedFeedback?.id === recording.id;
    }

    async function handleTranscriptionClick() {
        showTranscription = true;
    }

</script>
<section class="container">
<!--    This is the container on the left which contains Add new feedback button and feedback tab list-->
    <section class="left-container">
        <button class="send-button">Add new feedback</button>
        <section class="feedback-container">

            <input id="tab1" type="radio" name="tabs" checked>
            <label for="tab1">Text</label>

            <input id="tab2" type="radio" name="tabs">
            <label for="tab2">Audio</label>


            <section id="content-text" class="content-text">
                <List
                        items={texts}
                        labelPrefix="Text"
                        handleClick={handleTextFeedbackClick}
                        isSelected={isTextFeedbackSelected}
                />
            </section>

            <section id="content-audio" class="content-audio">
                <List
                        items={recordings}
                        labelPrefix="Audio"
                        handleClick={handleAudioFeedbackClick}
                        isSelected={isAudioFeedbackSelected}
                />
            </section>

        </section>
    </section>
<!--    This is the container on the right which contains the feedback previews-->
    <section class="right-container">
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
                    <!-- Directly display the content (no typewriter effect) -->
                    <p>{selectedFeedback.content}</p>
                {/if}
            {:else}
                <p style="text-align: center; padding-bottom: 5vh">
                    Select a feedback to view it here.
                </p>
            {/if}
        </section>
    </section>

</section>

<style>

    .container{
        display: flex;
        border: 0.225rem solid var(--clr-border);
    }

    .left-container{
        display: grid;
        text-align: center;
        padding: 1rem;
    }

    .right-container{
        display: flex;
        padding: 1rem;
        margin-left: auto;
        margin-right: auto;
    }

    .feedback-container {
        min-width: 20rem;
        max-width: 50rem;
        margin: 0 auto;
        background-color: var(--clr-background);
        padding: 1rem;
        border-radius: 0.5rem;
        /*border: 0.225rem solid var(--clr-border);*/
    }

    .content-text,
    .content-audio {
        display: none;
        padding: 1.25rem 0 0;
        border-top: 0.225rem solid var(--clr-border);

    }

    input {
        display: none;
    }

    label {
        display: inline-block;
        padding: 0.9rem 1.5rem;
        font-weight: 600;
        text-align: center;
        color: var(--clr-slate600);
        border: 0.225rem solid transparent;
        min-width: 20rem;
        max-width: 50rem;
    }

    label:hover {
        color: var(--clr-purple);
        cursor: pointer;
    }

    input:checked + label {
        color: var(--clr-purple);
        border: 0.225rem solid var(--clr-border);
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }

    #tab1:checked ~ #content-text,
    #tab2:checked ~ #content-audio {
        display: block;
    }


    .selected-feedback-display {
        display: flex;
        flex-direction: column;
        background-color: var(--clr-background);
        border-radius: 0.5rem;
        border: 0.225rem solid var(--clr-border);
        color: var(--clr-text);
        font-size: 1.5rem;
        text-align: left;
        padding-top: 10rem;
        gap: 1rem;
        overflow-y: auto;
        word-wrap: break-word;
        margin: 0 auto;
    }

    .feedback-header {
        font-size: 1rem;
        font-weight: bold;
        background-color: var(--clr-background);
        padding: 0.5rem;
        border-radius: 0.25rem;
        color: var(--clr-text);
    }

    .send-button {
        position: relative;
        background-color: var(--clr-background);
        border: 3px solid var(--clr-border);
        color: var(--clr-text);
        padding: 1rem;
        width: 20rem;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
        margin-left: auto;
        margin-right: auto;
    }

    .send-button:hover {
        box-shadow: 0 0 0.3125rem 0.0625rem var(--clr-purple);
        color: var(--clr-background);
    }


</style>