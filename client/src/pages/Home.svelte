<script>
    import AudioRecorder from "../components/AudioRecorder.svelte";
    import FeedbackButton from "../components/feedback-button.svelte";
    import {onMount} from "svelte";
    let feedbackText = '';
    let recordings = [];
    let texts = [];
    let selectedFeedback = null;

    // Fetch recordings and text feedback from the backend
    async function fetchFeedback() {
        try {
            const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
            const textsResponse = await fetch('http://localhost:3000/text-feedback');

            recordings = await recordingsResponse.json();
            texts = await textsResponse.json();
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    }

    // function handleFeedbackClick(feedback, type) {
    //     selectedFeedback = { ...feedback, type };
    // }

    function handleAudioFeedbackClick() {
        selectedFeedback = 'audio';
    }

    function handleTextFeedbackClick() {
        selectedFeedback = 'text';
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
                fetchFeedback(); // Refresh feedbacks after submission
            } else {
                console.error('Failed to save text:', await response.text());
            }
        } catch (error) {
            console.error('Error saving text:', error);
        }
    }

    function handleSend() {
        if (feedbackText.trim() === '') {
            console.log("No feedback provided!");
            return;
        }
        console.log("Feedback received:", feedbackText);
        saveTextFeedback(feedbackText);
        feedbackText = '';
    }

    // Fetch feedback when the component is mounted
    onMount(fetchFeedback);
</script>


<main class="container">
    <h1 style="margin-top: 50px">Feedbacks:</h1>
    <section class="feedback-sections">
        <!-- Recordings Section -->
        <section class="recordings">
            <header>
                <h2>Recordings</h2>
            </header>
            {#each recordings as recording}
                <FeedbackButton label={recording.file_path} onClick={() => handleAudioFeedbackClick()} />
            {/each}
        </section>

        <!-- Text Feedback Section -->
        <section class="texts">
            <header>
                <h2>Texts</h2>
            </header>
            {#each texts as text}
                <FeedbackButton label={text.file_path} onClick={() => handleTextFeedbackClick()} />
            {/each}
        </section>
    </section>

    <!-- Selected Feedback Display -->
    <section class="selected-feedback-display">
        {#if selectedFeedback}
            <header>
                <h3>
                    <!--{selectedFeedback.type === 'audio'-->
                    <!--    ? selectedFeedback.file_path-->
                    <!--    : selectedFeedback.feedback_text}-->
                    {#if selectedFeedback === 'audio'}
                        <link href="https://fonts.googleapis.com/css?family=Allerta" rel="stylesheet" />
                        <a>Audio Feedback</a>
                        <div class="container-audio">
                            <audio controls loop autoplay>
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    {:else}
                        <section>{selectedFeedback.feedback_text}</section>
                    {/if}
                </h3>
            </header>
        {:else}
            <section>Select a feedback to view it here!</section>
        {/if}
    </section>

    <!-- Input Feedback Section -->
    <h1 style="margin-top: 50px">Add Feedback:</h1>
    <section class="feedback-input">
        <AudioRecorder />
        <div class="text-feedback">
            <textarea bind:value={feedbackText} placeholder="Type here..." rows="3"></textarea>
            <button on:click={handleSend} class="send-button">Send</button>
        </div>
    </section>
</main>


<style>

    /* general page */
    body {
        font-family: Arial, sans-serif;
        background-color: #1e1e1e;
        color: #f0f0f0;
        margin: 0;
        padding: 0;
    }

    /* main container*/
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
    }

    .container h1 {
        font-size: 1.25rem;
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
        box-shadow: 0px 0px 5px 1px #9400FF;
        color: white;
    }





    .recording, .feedback-item {
        display: flex;
        align-items: center;
        background-color: #353535;
        border: 1px solid var(--clr-purple);
        border-radius: 5px;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
    }
    .recording:hover, .feedback-item:hover {
        background-color: var(--clr-purple);
        color: #ffffff;
    }




    /* Selected feedback */
    .selected-feedback-display {
        background-color: #2c2c2c;
        padding: 1rem; /* Consistent padding */
        padding-bottom: 10vh; /* Relative unit for bottom padding */
        border-radius: 0.5rem; /* Relative unit for border-radius */
        border-top: 0.1rem solid var(--clr-pink); /* Relative unit for border */
        color: white;
        font-size: 1.25rem; /* Relative font size */
        text-align: center;

        /* Flexbox for layout */
        display: flex;
        flex-direction: column; /* Stack items vertically */
        justify-content: center; /* Center all items vertically */
        align-items: center; /* Center all items horizontally */

        height: 50vh; /* Relative height */
        overflow-y: auto; /* Enable scrolling if content overflows */
    }

    .feedback-content {
        margin-top: 1rem;
    }

    .feedback-input {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 2rem;
    }




    /* audio recording */
    .record-audio {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background-color: #2c2c2c;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--clr-cyan);
    }
    .record-audio button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: #31DEF7;
        color: black;
        font-size: 1rem;
    }
    .record-audio button:hover {
        background-color: darkcyan;
        color: white;
    }




    /* text feedback */
    .text-feedback {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background-color: #2c2c2c;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--clr-cyan);
    }

    .text-feedback button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: #31DEF7;
        color: black;
        font-size: 1rem;
    }
    .text-feedback button:hover {
        background-color: darkcyan;
        color: white;
    }






    /* audio recording container */
    .record-audio-container {
        flex: 1;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        background-color: #353535;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid darkgrey;
    }
    .record-audio-container button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: red;
        color: black;
        font-size: 1rem;
    }
    .record-audio-container button:hover {
        box-shadow: 0px 0px 5px 1px red;
        background-color: red;
        color: white;
    }





    textarea {
        resize: none;
        padding: 1rem;
        padding-bottom: 100px;
        border-radius: 4px;
        border: 1px solid darkgrey;
        background-color: #353535;
        color: #ffffff;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
    }

    .audio-waveform {
        color: red;
        padding: 12px;
    }

    .container-audio {
        width: 300%;
        height: auto;
        padding: 20px;
        border-radius: 5px;
        background-color: #eee;
        color: #444;
        margin: 20px auto;
        overflow: hidden;
    }
    audio {
        width:100%;
    }


</style>