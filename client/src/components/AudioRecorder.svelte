<script>
    import {fade} from 'svelte/transition';

    const {onRecordingSaved} = $props();

    // Reactive state

    /**
     * @type {MediaStream|null} The stream obtained from the user's microphone.
     */
    let stream = $state(null);

    /**
     * @type {MediaStreamAudioSourceNode|null} The audio source node created from the stream.
     */
    let input = $state(null);

    /**
     * @type {MediaRecorder|null} The MediaRecorder instance used to record the audio stream.
     */
    let recorder = $state(null);

    /**
     * @type {string|null} The URL of the recorded audio blob.
     */
    let recording = $state(null);

    /**
     * @type {boolean} Whether audio is currently being recorded.
     */
    let isRecording = $state(false);

    /**
     * @type {boolean} Whether a recorded audio is currently being played.
     */
    let isPlaying = $state(false);

    /**
     * @type {BlobPart[]} Chunks of recorded audio data.
     */
    let chunks = $state([]);

    /**
     * @type {number[]} Array representing the volume bars for waveform visualization.
     */
    let bars = $state([]);

    /**
     * @type {boolean} Whether the waveform is currently being drawn.
     */
    let drawing = $state(false);

    /**
     * @type {boolean} Whether the recording is currently paused.
     */
    let isPaused = $state(false);

    /**
     * @type {string} Message text displayed to the user, e.g., for errors.
     */
    let message = $state('');

    /**
     * @type {boolean} Whether the message is visible.
     */
    let messageVisible = $state(false);

    // Additional states for indicator logic

    /**
     * @type {boolean} Whether the user has just cleared the recording.
     */
    let justCleared = $state(false);

    /**
     * @type {boolean} Whether the user has just saved the recording.
     */
    let justSaved = $state(false);

    /**
     * @type {boolean} Whether the user has just stopped the recording by pressing the Record button again.
     */
    let justStopped = $state(false);

    /**
     * @type {boolean} Whether the user has just stopped playback by pressing the Play button again.
     */
    let justStoppedPlaying = $state(false);

    // DOM references

    /**
     * @type {HTMLCanvasElement} The canvas element used to draw the waveform.
     */
    let canvas;

    /**
     * @type {HTMLAudioElement} The audio element used for playback of the recorded audio.
     */
    let audioPlayer;

    // Constants for waveform visualization
    const barWidth = 2;
    const barGutter = 2;
    const barColor = "#9400FF";

    // Audio and waveform analysis context
    let audioContext;
    let analyser;
    let scriptProcessor;
    let audioName;

    // Canvas variables
    let canvasContext;
    let width = 0;
    let height = 0;
    let halfHeight = 0;

    /**
     * @type {number} The current recording time in hundredths of a second.
     * For example, 125 represents 1.25 seconds.
     */
    let recordingTime = $state(0);

    /**
     * Interval ID for the high-resolution timer (every 10ms).
     * @type {number|undefined}
     */
    let recordingInterval;

    /**
     * Sets a message and makes it visible to the user.
     * @param {string} text The message text to display.
     */
    function setMessage(text) {
        message = text;
        messageVisible = true;
    }

    /**
     * Hides the currently visible message.
     */
    function hideMessage() {
        messageVisible = false;
    }

    /**
     * Requests access to the user's microphone.
     * If successful, it initializes the audio stream. Otherwise, shows an error message.
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
     * On `ondataavailable`, chunks are pushed.
     * On `onstop`, a recording blob URL is created.
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
     * Uploads the audio file to the server along with its duration and name.
     * @param {Blob} blob The audio file to upload.
     * @param {string} audioName The name of the file to be created.
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
                // Indicate that we have just saved
                justSaved = true;
                justCleared = false;
                justStopped = false;
                // Reset the timer only after saving
                recordingTime = 0;
                resetIndicatorStateLater();
            } else {
                console.error('Failed to upload audio:', await response.text());
            }
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    }

    /**
     * Saves the recording to the server by prompting for a name and then uploading it.
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
        isPaused = false;
        justCleared = false;
        justSaved = false;
        justStopped = false;
        isPlaying = false;

        // Reset recording time whenever we start a new recording
        recordingTime = 0;

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
     * Toggles recording audio. If currently recording, it stops and sets `justStopped`.
     * Otherwise, it starts a new recording session.
     */
    function toggleRecording() {
        if (isRecording) {
            stopRecording();
            justStopped = true;
            justCleared = false;
            justSaved = false;
            isPaused = false;
            isPlaying = false;
            resetIndicatorStateLater();
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
     * If recording and not paused, it calculates the volume and renders bars.
     * If paused, it renders the last known bars.
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
        isPaused = false;
        justCleared = false;
        justSaved = false;
        justStopped = false;
        audioPlayer.play();
    }

    /**
     * Stops the audio recording playback.
     */
    function stop() {
        isPlaying = false;
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }

    /**
     * Toggles playing the audio recording.
     * If currently playing, pressing again stops playback and shows `justStoppedPlaying`.
     * Otherwise, it starts playback.
     */
    function togglePlay() {
        if (isPlaying) {
            stop();
            justStoppedPlaying = true;
            justCleared = false;
            justSaved = false;
            justStopped = false;
            resetIndicatorStateLater();
        } else {
            play();
            justStoppedPlaying = false;
        }
    }

    /**
     * Clears the recording and stops the audio player.
     * Resets all related states and shows the 'cleared' indicator.
     */
    function clearRecording() {
        if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
            recorder.stop();
        }
        isRecording = false;
        isPaused = false;
        isPlaying = false;
        bars = [];
        renderBars(bars);
        recording = null;
        justCleared = true;
        justSaved = false;
        justStopped = false;
        // Reset the timer after clearing
        recordingTime = 0;
        resetIndicatorStateLater();
    }

    /**
     * Lifecycle function that runs when the component is mounted to the DOM.
     * Requests microphone access and returns a cleanup function to close the audio context and stop streams.
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

    /**
     * Resets the indicator state after a few seconds
     * if a transient action (like cleared, saved, or stopped) was performed.
     */
    function resetIndicatorStateLater() {
        setTimeout(() => {
            if (!isRecording && !isPlaying && !isPaused && !justSaved && !justCleared && !justStopped && !justStoppedPlaying) {
                // Reset states if needed - currently does nothing, but can be extended.
            }
        }, 3000);
    }

    /**
     * @type {{type: string}} An object representing the current indicator symbol state.
     */
    let indicatorSymbol = $state({ type: 'none' });

    /**
     * Reactive effect that updates the indicator symbol based on the current states.
     */
    $effect(() => {
        indicatorSymbol = getIndicatorSymbol();
    });

    /**
     * Determines which indicator symbol to display based on the current recording/playback states.
     * Returns an object of the form { type: 'someState' }.
     *
     * States:
     * - recording: Red blinking circle
     * - paused: Green pause icon
     * - playing: Green blinking play icon
     * - cleared: Red cross
     * - saved: Green checkmark
     * - stopped: White square (when recording is stopped by pressing record again)
     * - stoppedPlaying: Green square (when playback is stopped by pressing play again)
     * - none: No active icon
     *
     * @returns {{type: string}} An object representing the current indicator state.
     */
    function getIndicatorSymbol() {
        if (isRecording && !isPaused) {
            return { type: 'recording' };
        }
        if (isPaused) {
            return { type: 'paused' };
        }
        if (isPlaying) {
            return { type: 'playing' };
        }
        if (justCleared) {
            return { type: 'cleared' };
        }
        if (justSaved) {
            return { type: 'saved' };
        }
        if (justStopped) {
            return {type: 'stopped'};
        }
        if (justStoppedPlaying) {
            return { type: 'stoppedPlaying' };
        }
        return { type: 'none' };
    }

    /**
     * Formats the given recording time in hundredths of a second into MM:SS.hh format.
     * @param {number} hundredths - The time in hundredths of a second.
     * @returns {string} Formatted time as "MM:SS.hh"
     */
    function formatTime(hundredths) {
        const totalSeconds = Math.floor(hundredths / 100);
        const h = hundredths % 100; // hundredths of a second
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;

        const mm = m < 10 ? '0' + m : m;
        const ss = s < 10 ? '0' + s : s;
        const hh = h < 10 ? '0' + h : h;

        return `${mm}:${ss}.${hh}`;
    }

    /**
     * Effect that handles the high-resolution recording timer.
     * When recording and not paused, increment recordingTime every 10ms.
     */
    $effect(() => {
        if (isRecording && !isPaused) {
            // Start or continue the interval if not already set
            if (!recordingInterval) {
                recordingInterval = setInterval(() => {
                    recordingTime++;
                },10); // increment every 10ms
            }
        } else {
            // Not actively recording, clear the interval if set
            if (recordingInterval) {
                clearInterval(recordingInterval);
                recordingInterval = undefined;
            }
        }
    });

</script>

<div class="recorder-container gradient-border">
    <!-- Indicator in the top-right corner -->
    <div class="status-indicator {indicatorSymbol.type}">
        {#if indicatorSymbol.type === 'recording'}
            <!-- Red blinking circle -->
            <div class="icon circle"></div>
        {:else if indicatorSymbol.type === 'paused'}
            <!-- Green pause sign -->
            <div class="icon pause">&#10073;&#10073;</div>
        {:else if indicatorSymbol.type === 'playing'}
            <!-- Green play triangle -->
            <div class="icon play">&#9658;</div>
        {:else if indicatorSymbol.type === 'cleared'}
            <!-- Red cross -->
            <div class="icon cleared">&#10006;</div>
        {:else if indicatorSymbol.type === 'saved'}
            <!-- Green checkmark -->
            <div class="icon saved">&#10004;</div>
        {:else if indicatorSymbol.type === 'stopped'}
            <!-- White square -->
            <div class="icon stopped"></div>
        {:else if indicatorSymbol.type === 'stoppedPlaying'}
            <!-- Green square -->
            <div class="icon stoppedPlaying"></div>
        {/if}
    </div>
    <div class="audio-recorder">
        <!-- Display current recording time in MM:SS.hh -->
        <div class="recording-time">
            {formatTime(recordingTime)}
        </div>
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
        position: relative; /* Needed for status-indicator positioning */
    }

    .status-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .status-indicator .icon {
        font-size: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* For recording: red blinking circle */
    .status-indicator.recording .icon.circle {
        width: 15px;
        height: 15px;
        background-color: red;
        border-radius: 50%;
        animation: blink 1s infinite alternate;
    }

    @keyframes blink {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    /* Paused: green pause icon */
    .status-indicator.paused .icon.pause {
        color: green;
    }

    /* Playing: green play triangle (blinking) */
    .status-indicator.playing .icon.play {
        color: green;
        animation: blink 1s infinite alternate;
    }

    /* Cleared: red cross */
    .status-indicator.cleared .icon.cleared {
        color: red;
    }

    /* Saved: green checkmark */
    .status-indicator.saved .icon.saved {
        color: green;
    }

    /* White square for stopped state */
    .status-indicator.stopped .icon.stopped {
        width: 15px;
        height: 15px;
        background-color: white;
    }

    /* Green square for stoppedPlayback state */
    .status-indicator.stoppedPlaying .icon.stoppedPlaying {
        width: 15px;
        height: 15px;
        background-color: green;
    }

    /* Display time on top */
    .recording-time {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: white;
    }

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
        background: linear-gradient(
                90deg,
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

    .control-button.disabled {
        opacity: 0.5;
        cursor: not-allowed;
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