<script>
    import { onMount } from 'svelte';

    /**
     * MediaRecorder instance for recording audio.
     * @type {MediaRecorder|undefined}
     */
    let recorder;

    /**
     * MediaStream instance obtained from the user's microphone.
     * @type {MediaStream|undefined}
     */
    let stream;

    /**
     * Array to store recorded audio data chunks.
     * @type {BlobPart[]}
     */
    let items = [];

    /**
     * UI state variables for button enabling/disabling.
     * @type {boolean}
     */
    let startDisabled = false;
    let pauseDisabled = true;
    let finishDisabled = true;

    /**
     * The text displayed on the pause/resume button.
     * @type {string}
     */
    let pauseText = "Pause";

    /**
     * Lifecycle hook that runs after the component is mounted.
     * Attempts to request microphone access and store the MediaStream.
     */
    onMount(async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Failed to access the microphone. Please check your permissions.");
        }
    });

    /**
     * Starts recording audio by initializing the MediaRecorder if needed,
     * and begins capturing audio chunks.
     *
     * - Disables the "Start" button.
     * - Enables the "Pause" and "Finish" buttons.
     */
    function startRecording() {
        if (!recorder) {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                items.push(e.data);
            };
        }

        recorder.start();
        startDisabled = true;
        pauseDisabled = false;
        finishDisabled = false;
    }

    /**
     * Toggles between pausing and resuming the recording.
     * Updates the pause button text accordingly.
     */
    function togglePause() {
        if (recorder.state === 'recording') {
            recorder.pause();
            pauseText = "Resume";
        } else if (recorder.state === 'paused') {
            recorder.resume();
            pauseText = "Pause";
        }
    }

    /**
     * Stops the recording process and uploads the recorded audio to the server.
     * On recorder stop:
     *  - Creates a Blob from the recorded chunks.
     *  - Decodes the audio data to determine duration.
     *  - Sends the audio file and duration to the server via a POST request.
     *  - Resets the UI state to allow a new recording session.
     */
    async function finishRecording() {
        if (recorder && recorder.state !== 'inactive') {
            recorder.stop();
            recorder.onstop = async () => {
                const blob = new Blob(items, { type: 'audio/wav' });
                const formData = new FormData();

                // Decode the audio file to get the duration
                const audioContext = new AudioContext();
                const arrayBuffer = await blob.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                const duration = audioBuffer.duration;

                // Append the audio and metadata to the FormData
                formData.append('audio', blob, 'recording.wav');
                formData.append('duration', Math.round(duration).toString());

                try {
                    const response = await fetch('http://localhost:3000/upload-audio', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Audio uploaded successfully:', result);
                    } else {
                        console.error('Failed to upload audio:', await response.text());
                    }
                } catch (err) {
                    console.error('Error uploading audio:', err);
                }

                // Reset state
                items = [];
                startDisabled = false;
                pauseDisabled = true;
                finishDisabled = true;
                pauseText = "Pause";
            };
        }
    }
</script>

<div class="audio">
    <button on:click={startRecording} disabled={startDisabled}>Start</button>
    <button on:click={togglePause} disabled={pauseDisabled}>{pauseText}</button>
    <button on:click={finishRecording} disabled={finishDisabled}>Finish</button>
    <div id="audioContainer"></div>
</div>

<style>
    .audio {
        width: 400px;
        height: 600px;
        border-radius: 20px;
        padding: 20px;
        border: 2px solid #757575;
        margin: 50px auto;
        text-align: center;
    }

    button {
        margin: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #8F62EC;
        color: white;
        cursor: pointer;
        font-size: 16px;
    }

    button:disabled {
        background-color: #3963F2;
        cursor: not-allowed;
    }
</style>