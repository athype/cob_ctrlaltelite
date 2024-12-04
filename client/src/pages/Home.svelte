<script>
    import { onMount } from "svelte";
    import FeedbackButton from '../components/feedback-button.svelte';  // Assuming you have this component

    let recordings = [];  // Array to store fetched recordings
    const feedbackDisplay = document.querySelector('.selected-feedback-display');

    // Fetch feedback recordings on component mount
    async function fetchFeedback() {
        try {
            const response = await fetch('http://localhost:5137/audio-feedback');
            recordings = await response.json();
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }

        // try {
        //     const response = await fetch('http://localhost:5137/text-feedback');
        //     recordings = await response.json();
        // } catch (error) {
        //     console.error('Error fetching feedback:', error);
        // }
    }

    // Fetch recordings when the component is mounted
    onMount(fetchFeedback);

    // Update the selected feedback display
    function updateFeedbackDisplay(feedback) {
        feedbackDisplay.innerHTML = `
            <header>
                <h3>${feedback.file_path}</h3>
            </header>
            <div>
                <button onclick="playAudio('${feedback.file_path}')">Play</button>
                <div class="audio-waveform">${feedback.waveform}</div>
            </div>
            <p><strong>Date:</strong> ${feedback.created_at}</p>
        `;
    }

    // Play the audio when the play button is clicked
    function playAudio(filePath) {
        const audio = new Audio(filePath);
        audio.play();
    }

    // Handle feedback button click
    function handleFeedbackClick(recording) {
        updateFeedbackDisplay(recording);
    }
</script>

<main class="container">
    <h1 style="margin-top: 50px">Feedbacks:</h1>
    <section class="feedback-sections">
        <!-- Recordings Section -->
        <section class="recordings">
            <header>
                <h2>Recordings</h2>
            </header>
            <!-- Dynamically loaded recordings -->
            {#each recordings as recording}
                <FeedbackButton label={recording.file_path} onClick={() => handleFeedbackClick(recording)} />
            {/each}
        </section>

        <!-- Text Feedback Section -->
        <section class="texts">
            <header>
                <h2>Texts</h2>
            </header>

            <!-- Add dynamic rendering for text feedback if needed -->
        </section>
    </section>

    <!-- Selected feedback section -->
    <section class="selected-feedback">
        <section>Select a feedback to view it here!</section>
    </section>

    <!-- Add Feedback Section -->
    <h1 style="margin-top: 50px">Add Feedback:</h1>
    <section class="feedback-input">
        <div class="record-audio">
            <section class="record-audio-container">
                <button class="record-button">⚪</button>
                <div class="audio-waveform">|-╹-〢--╿-╽---〡-╷-〣-╻-╹-╿---╹-╿---╹-╿---╹-〣-╻-╹-╿-╽-┃-│</div>
            </section>
            <button class="send-button">Send</button>
        </div>

        <div class="text-feedback">
            <textarea placeholder="Type here..." rows="3"></textarea>
            <button class="send-button">Send</button>
        </div>
    </section>
</main>


<style>

    /* general page */


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
    .feedback-button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: var(--clr-purple);
        color: black;
        font-size: 1rem;
        width: 100%;
    }

    .feedback-button {
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




    /* selected feedback */
    .selected-feedback {
        background-color: #2c2c2c;
        padding: 1rem;
        padding-bottom: 150px;
        border-radius: 8px;
        border: 2px solid var(--clr-pink);
        color: white;
        font-size: 20px;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
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
</style>