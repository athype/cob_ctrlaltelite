<script>
    import {fade} from 'svelte/transition';

    const {onRecordingSaved} = $props();

    // Reactive state
    let stream = $state(null);
    let input = $state(null);
    let recorder = $state(null);
    let recording = $state(null);
    let isRecording = $state(false);
    let isPlaying = $state(false);
    let chunks = $state([]);
    let bars = $state([]);
    let drawing = $state(false);
    let isPaused = $state(false);
    let message = $state('');
    let messageVisible = $state(false);

    // DOM references
    let canvas;
    let audioPlayer;

    // Constants
    const barWidth = 2;
    const barGutter = 2;
    const barColor = "#9400FF";
    let audioContext;
    let analyser;
    let scriptProcessor;
    let audioName;

    // Canvas variables
    let canvasContext;
    let width = 0;
    let height = 0;
    let halfHeight = 0;

    function setMessage(text) {
        message = text;
        messageVisible = true;
    }

    function hideMessage() {
        messageVisible = false;
    }

    /**
     * Requests access to the user's microphone.
     */
    async function requestMicrophoneAccess() {
        if (!window.AudioContext) {
            setMessage('Your browser does not support window.AudioContext. This is needed for this demo to work.');
            return;
        }

        if (navigator.mediaDevices) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setAudioStream(stream);
            } catch (error) {
                setMessage('Something went wrong requesting the userMedia. Please use HTTPS.');
            }
        } else {
            setMessage('Your browser does not support navigator.mediaDevices.');
        }
    }

    /**
     * Sets up the audio stream and creates the necessary audio nodes.
     * @param {MediaStream} stream The audio stream from the user's microphone.
     */
    function setAudioStream(stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;

        input = audioContext.createMediaStreamSource(stream);
        recorder = new MediaRecorder(stream);

        setRecorderActions();
        setupWaveform();
    }

    /**
     * Sets the actions for the MediaRecorder instance.
     */
    function setRecorderActions() {
        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = () => {
            console.log("Recorder stopped");
            recording = URL.createObjectURL(new Blob(chunks, {'type': 'audio/wav; codecs=opus'}));
            chunks = [];
        };
    }

    /**
     * Uploads the audio file to the server.
     * @param {Blob} blob The audio file to upload.
     * @param audioName The name of the file to be created.
     */
    async function uploadAudio(blob, audioName) {
        const formData = new FormData();

        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = Math.round(audioBuffer.duration);

        formData.append('audio', blob, 'recording.wav');
        formData.append('duration', duration.toString());
        formData.append('name', audioName);

        try {
            const response = await fetch('http://localhost:3000/upload-audio', {
                method: 'POST',
                body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Audio uploaded successfully:', result);
                onRecordingSaved?.();
        } else {
            console.error('Failed to upload audio:', await response.text());
        }
            } catch (error) {
        console.error('Error uploading audio:', error);
    }   
    }

    /**
     * Saves the recording to the server.
     */
    function saveRecording() {
        if (!recording) {
            console.error('No recording to save.');
            return;
        }

        audioName = window.prompt('Enter a name for your audio recording:', 'My Recording');
        if (!audioName) {
            console.error('No name entered. Aborting upload.');
            return; // Do not proceed without a name
        }

        fetch(recording)
            .then((res) => res.blob())
            .then((blob) => {
                console.log('Blob prepared for upload:', blob);
                uploadAudio(blob, audioName);
            })
        .catch((error) => console.error('Error preparing audio for upload:', error));
    }

    /**
     * Starts recording audio.
     */
    function startRecording() {
        isRecording = true;
        recorder.start();
    }

    /**
     * Stops recording audio.
     */
    function stopRecording() {
        isRecording = false;
        recorder.stop();
    }

    /**
     * Pauses or resumes recording audio.
     */
    function pauseRecording() {
        if (recorder && recorder.state === 'recording') {
            recorder.pause();
            isPaused = true;
        } else if (recorder && recorder.state === 'paused') {
            recorder.resume();
            isPaused = false;
        }
    }

    /**
     * Toggles recording audio.
     */
    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    /**
     * Sets up the waveform canvas. The waveform is drawn based on the audio input.
     */
    function setupWaveform() {
        canvasContext = canvas.getContext('2d');
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        halfHeight = height / 2;

        canvasContext.canvas.width = width;
        canvasContext.canvas.height = height;

        input.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = processInput;
    }

    /**
     * Processes the audio input to be used in rendering the waveform.
     */
    function processInput() {
        if (isRecording && !isPaused) {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            const average = getAverageVolume(array);
            bars = [...bars, average];

            if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
                renderBars(bars);
            } else {
                renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))));
            }
        } else if (isPaused) {
            renderBars(bars);
        }
    }

    /**
     * Calculates the average volume of the audio input.
     * @param {Uint8Array} array The audio input array.
     * @returns {number} The average volume.
     */
    function getAverageVolume(array) {
        return array.reduce((sum, value) => sum + value, 0) / array.length;
    }

    /**
     * Renders the bars of the waveform.
     * @param {number[]} currentBars The current bars to render.
     */
    function renderBars(currentBars) {
        if (!drawing) {
            drawing = true;

            requestAnimationFrame(() => {
                canvasContext.clearRect(0, 0, width, height);

                currentBars.forEach((bar, index) => {
                    canvasContext.fillStyle = barColor;
                    const x = index * (barWidth + barGutter);
                    const barHeight = halfHeight * (bar / 100);

                    canvasContext.fillRect(x, halfHeight - barHeight, barWidth, barHeight);
                    canvasContext.fillRect(x, halfHeight, barWidth, barHeight);
                });

                drawing = false;
            });
        }
    }


    /**
     * Plays the audio recording.
     */
    function play() {
        isPlaying = true;
        audioPlayer.play();
    }

    /**
     * Stops the audio recording.
     */
    function stop() {
        isPlaying = false;
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }

    /**
     * Toggles playing the audio recording.
     */
    function togglePlay() {
        if (isPlaying) {
            stop();
        } else {
            play();
        }
    }

    /**
     * Clears the recording and stops the audio player.
     */
    function clearRecording() {
        if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
            recorder.stop();
        }
        isRecording = false;
        isPaused = false;
        bars = [];
        renderBars(bars);
        recording = null;
    }

    /**
     * Lifecycle function that runs when the component is mounted to the DOM.
     */
    $effect(() => {
        requestMicrophoneAccess();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (audioContext) {
                audioContext.close();
            }
        };
    });
</script>
<div class="recorder-container gradient-border">
    <div class="audio-recorder">
        <div class="waveform">
            <canvas
                    bind:this={canvas}
                    class="js-canvas waveform__canvas"
            ></canvas>
        </div>

        <div class="controls">
            <button
                    class="control-button gradient-border-button record-button"
                    class:active={isRecording}
                    onclick={toggleRecording}
            >
                Record
            </button>

            <button
                    class="control-button gradient-border-button pause-button"
                    onclick={pauseRecording}
            >
                {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
                    class="control-button gradient-border-button play-button"
                    class:disabled={!recording}
                    class:active={isPlaying}
                    onclick={togglePlay}
            >
                Play
            </button>

            <button
                    class="control-button gradient-border-button clear-button"
                    onclick={clearRecording}
            >
                Clear
            </button>

            <button
                    class="control-button gradient-border-button save-button"
                    onclick={saveRecording}
                    disabled={!recording}
            >
                Save
            </button>
        </div>

        <audio
                bind:this={audioPlayer}
                src={recording}
                onended={stop}
        ></audio>

        {#if messageVisible}
            <div class="message" transition:fade>
                {message}
            </div>
        {/if}
    </div>
</div>


<style>
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }


    .recorder-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 1600px;
        margin: 2rem auto 0;
        border-radius: 10px;
    }

    /* Nasty hack to get the gradient buttons to work */

    .recorder-container :global(.gradient-border-button) {
        position: relative;
        background: transparent;
        z-index: 0;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
    }

    .recorder-container :global(.gradient-border-button::before) {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(90deg,
        var(--clr-pink),
        var(--clr-dark-blue),
        var(--clr-cyan),
        var(--clr-pink)
        );
        background-size: 200% 100%;
        z-index: -1;
        transition: all 0.5s ease;
        border-radius: inherit;
    }

    .recorder-container :global(.gradient-border-button::after) {
        content: '';
        position: absolute;
        inset: 2px;
        background: var(--clr-dark);
        z-index: -1;
        border-radius: inherit;
    }

    .recorder-container :global(.gradient-border-button:hover::before) {
        background-position: 100% 0;
    }


    .control-button.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .audio-recorder {
        width: 100%;
        padding: 2rem;
    }

    .waveform {
        position: relative;
        padding: 2rem 0;
        width: 100%;
    }

    .waveform__canvas {
        width: 100%;
        height: 10rem;
        display: block;
    }

    .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
    }

    .disabled {
        opacity: 0.2;
        pointer-events: none;
        cursor: not-allowed;
    }

    .audio {
        width: 0;
        height: 0;
        opacity: 0;
    }

    .message {
        transition: opacity 0.4s ease-in-out;
        padding: 1rem 2rem;
        background: #ff0000;
        opacity: 0;
        font-size: 1.6rem;
        font-family: Helvetica, Arial, sans-serif;
        color: #ffffff;
        line-height: 1.5;
    }

    .message--visible {
        opacity: 1;
    }
</style>