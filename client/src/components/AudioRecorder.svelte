<script>
    import { onMount } from 'svelte';

    // Reactive state
    let stream = null;
    let input = null;
    let recorder = null;
    let recording = null;
    let isRecording = false;
    let isPlaying = false;
    let chunks = [];
    let bars = [];
    let drawing = false;
    let isPaused = false;

    // DOM references
    let canvas;
    let audioPlayer;
    let messageContainer;
    let playButton;
    let pauseButton;
    let clearButton;
    let saveButton;

    // Constants
    const barWidth = 2;
    const barGutter = 2;
    const barColor = "#9400FF";
    let audioContext;
    let analyser;
    let scriptProcessor;

    // Canvas variables
    let canvasContext;
    let width = 0;
    let height = 0;
    let halfHeight = 0;

    function setMessage(message) {
        if (messageContainer) {
            messageContainer.innerHTML = message;
            messageContainer.classList.add('message--visible');
        }
    }

    function hideMessage() {
        messageContainer?.classList.remove('message--visible');
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
            recording = URL.createObjectURL(new Blob(chunks, { 'type': 'audio/wav; codecs=opus' }));
            chunks = [];
            audioPlayer.setAttribute('src', recording);
            playButton.classList.remove('disabled');
        };
    }

    /**
     * Uploads the audio file to the server.
     * @param {Blob} blob The audio file to upload.
     */
    async function uploadAudio(blob) {

        const formData = new FormData();

        // Decode the audio file to calculate duration
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = Math.round(audioBuffer.duration);

        // Append audio and metadata to FormData
        formData.append('audio', blob, 'recording.wav');
        formData.append('duration', duration.toString()); // Duration in seconds

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
            } catch (error) {
        console.error('Error uploading audio:', error);
    }
    }

    /**
     * Saves the recording to the server.
     */
    function saveRecording() {
        console.log('Save button clicked.');
        if (!recording) {
            console.error('No recording to save.');
            return;
        }

        fetch(recording)
            .then((res) => res.blob())
            .then((blob) => {
                console.log('Blob prepared for upload:', blob);
                uploadAudio(blob);
            })
        .catch((error) => console.error('Error preparing audio for upload:', error));
    }

    /**
     * Starts recording audio.
     */
    function startRecording() {
        isRecording = true;
        document.querySelector('.js-record').classList.add('active');
        recorder.start();
    }

    /**
     * Stops recording audio.
     */
    function stopRecording() {
        isRecording = false;
        document.querySelector('.js-record').classList.remove('active');
        recorder.stop();
    }

    /**
     * Pauses or resumes recording audio.
     */
    function pauseRecording() {
        if (recorder && recorder.state === 'recording') {
            recorder.pause();
            isPaused = true;
            pauseButton.textContent = 'Resume';
        } else if (recorder && recorder.state === 'paused') {
            recorder.resume();
            isPaused = false;
            pauseButton.textContent = 'Pause';
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
        playButton.classList.add('active');
    }

    /**
     * Stops the audio recording.
     */
    function stop() {
        isPlaying = false;
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playButton.classList.remove('active');
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
        audioPlayer.setAttribute('src', '');
        playButton.classList.add('disabled');
        pauseButton.textContent = 'Pause';
    }

    /**
     * Lifecycle function that runs when the component is mounted to the DOM.
     */
    onMount(() => {
        canvas = document.querySelector('.js-canvas');
        audioPlayer = document.querySelector('.js-audio');
        messageContainer = document.querySelector('.js-message');
        playButton = document.querySelector('.js-play');
        pauseButton = document.querySelector('.js-pause');
        clearButton = document.querySelector('.js-clear');
        saveButton = document.querySelector('.js-save-button');

        requestMicrophoneAccess();
        audioPlayer.addEventListener('ended', stop);

        document.querySelector('.js-record').addEventListener('mouseup', toggleRecording);
        saveButton.addEventListener('mouseup', saveRecording);
        pauseButton.addEventListener('mouseup', pauseRecording);
        clearButton.addEventListener('mouseup', clearRecording);
        playButton.addEventListener('mouseup', togglePlay);

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (audioContext) {
                audioContext.close();
            }
            pauseButton.removeEventListener('mouseup', pauseRecording);
            clearButton.removeEventListener('mouseup', clearRecording);
        };
    });
</script>

<div class="recorder-container gradient-border">
    <div class="recorder">
        <div class="waveform">
            <canvas class="js-canvas waveform__canvas"></canvas>
        </div>
        <div class="toolbar">
            <button class="gradient-border-button js-record record-button">
                Record
            </button>
            <button class="gradient-border-button js-pause pause-button">
                Pause
            </button>
            <button class="gradient-border-button js-play play-button disabled">
                Play
            </button>
            <button class="gradient-border-button js-save-button save-button">
                Save
            </button>
            <button class="gradient-border-button js-clear clear-button">
                Clear
            </button>
            <audio class="js-audio audio" controls/>
        </div>
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

    .recorder {
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

    .toolbar {
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
        background: #ff0000; /* Replace $red with actual color */
        opacity: 0;
        font-size: 1.6rem;
        font-family: Helvetica, Arial, sans-serif;
        color: #ffffff; /* Replace $white with actual color */
        line-height: 1.5;
    }

    .message--visible {
        opacity: 1;
    }
</style>