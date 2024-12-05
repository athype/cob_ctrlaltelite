<script>
    import { onMount } from 'svelte';

    let recorder;
    let stream;
    let items = [];
    let startDisabled = false;
    let pauseDisabled = true;
    let finishDisabled = true;
    let pauseText = "Pause";

    onMount(async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Failed to access the microphone. Please check your permissions.");
        }
    });

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

    function togglePause() {
        if (recorder.state === 'recording') {
            recorder.pause();
            pauseText = "Resume";
        } else if (recorder.state === 'paused') {
            recorder.resume();
            pauseText = "Pause";
        }
    }

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
                formData.append('duration', Math.round(duration).toString()); // Send duration in seconds


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
