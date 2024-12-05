<script>
    // for joining with backend (in progress)
    import AudioRecorder from "../components/AudioRecorder.svelte";
    let feedbackText = '';

    function handleSend() {
        if (feedbackText.trim() === '') {
            console.log("No feedback provided!");
            return;
        }

        console.log("Feedback received:", feedbackText);

        saveTextFeedback(feedbackText);
        feedbackText = '';
    }

    async function saveTextFeedback(text_feedback){
        try {
            const response = await fetch('http://localhost:3000/text_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback_text: text_feedback })
            });
        if (response.ok) {
            const result = await response.json();
            console.log('Text feedback saved successfully:', result);
        } else {
            console.error('Failed to save text:', await response.text());
        }
        } catch (error ){
            console.error('Error saving text:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const recordingsSection = document.querySelector('.recordings');
        const textsSection = document.querySelector('.texts');
        const feedbackDisplay = document.querySelector('.selected-feedback-display');

        // fetch recordings and text feedback from the backend
        async function fetchFeedback() {
            try {
                const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
                const textsResponse = await fetch('http://localhost:3000/text-feedback');

                const recordings = await recordingsResponse.json();
                const texts = await textsResponse.json();

                recordings.forEach(recording => {
                    const recordingElement = document.createElement('button');
                    recordingElement.innerHTML = `
                        <button>${recording.file_path}</button>
                    `;
                    recordingElement.addEventListener('click', () => {
                        updateFeedbackDisplay(recording, 'audio');
                    });
                    recordingsSection.appendChild(recordingElement);
                });

                texts.forEach(text => {
                    const textElement = document.createElement('button');
                    textElement.classList.add('feedback-item');
                    textElement.innerHTML = `
                        <p class="feedback-name">${text.feedback_text}</p>
                        <time class="feedback-date">${text.created_at}</time>
                    `;
                    textElement.addEventListener('click', () => {
                        updateFeedbackDisplay(text, 'text');
                    });
                    textsSection.appendChild(textElement);
                });
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        }

        // Update the selected feedback display
        function updateFeedbackDisplay(feedback, type) {
            if (type === 'audio') {
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
            } else if (type === 'text') {
                feedbackDisplay.innerHTML = `
                    <header>
                        <h3>${feedback.feedback_text}</h3>
                    </header>
                    <p><strong>Date:</strong> ${feedback.created_at}</p>
                `;
            }
        }

        // Play the audio when the play button is clicked
        function playAudio(filePath) {
            const audio = new Audio(filePath);
            audio.play();
        }

        fetchFeedback();
    });
</script>

<main class="container">
    <h1 style="margin-top: 50px">Feedbacks:</h1>
    <section class="feedback-sections">
        <!-- recordings Section -->
        <section class="recordings">
            <header>
                <h2>Recordings</h2>
            </header>

            <!-- dummies -->
            <button>Feedback 21/09/24</button>


            <!-- dynamically loaded recordings -->
        </section>

        <!-- text Feedback Section -->
        <section class="texts">
            <header>
                <h2>Texts</h2>
            </header>

            <!-- dummies -->
            <button>Feedback 21/09/24</button>


            <!-- dynamically loaded text feedback -->
        </section>
    </section>

    <!-- selected feedback section -->
    <section class="selected-feedback">
        <section>Select a feedback to view it here!</section>
    </section>

    <!-- input feedback section -->
    <h1 style="margin-top: 50px">Add Feedback:</h1>
    <section class="feedback-input">
<!--        <div class="record-audio">-->
<!--            <section class="record-audio-container">-->
<!--                <button class="record-button">⚪</button>-->
<!--                <div class="audio-waveform">|-╹-〢&#45;&#45;╿-╽-&#45;&#45;〡-╷-〣-╻-╹-╿-&#45;&#45;╹-╿-&#45;&#45;╹-╿-&#45;&#45;╹-〣-╻-╹-╿-╽-┃-│</div>-->
<!--            </section>-->
<!--            <button class="send-button">Send</button>-->
<!--        </div>-->
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