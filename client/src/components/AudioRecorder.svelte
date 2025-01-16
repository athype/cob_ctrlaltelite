<script>
    import {fade} from 'svelte/transition';
    const {onRecordingSaved, showModal} = $props();

    let isBeforeRecording = $state(true);
    let isAfterRecording = $state(false);



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

    // Additional states for indicator logic
    let justCleared = $state(false);
    let justSaved = $state(false);
    let justStopped = $state(false);
    let justStoppedPlaying = $state(false);

    // DOM references
    let canvas;
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
    let waveformWidth = 0;
    let width = 0;
    let height = 0;
    let halfHeight = 0;

    let playbackTime = 0; // Current playback time
    const playbackBarColor = "#7d7d7d";
    let canvasPositionX = 0;
    let temporaryDuration = 0;

    /**
     * @type {number} The current recording time in hundredths of a second.
     * For example, 125 represents 1.25 seconds.
     */
    let recordingTime = $state(0);

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
     * Methods to toggle between button visibility
     */
    function showBeforeButtons() {
        isBeforeRecording = true;
        isAfterRecording = false;
    }

    function showAfterButtons() {
        isBeforeRecording = false;
        isAfterRecording = true;
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
                showModal?.("Success!");
                // Indicate that we have just saved
                justSaved = true;
                justCleared = false;
                justStopped = false;
                // Reset the timer only after saving
                recordingTime = 0;
                resetIndicatorStateLater();
            } else {
                showModal?.("Failure :(");
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
        // Capture the current time just before stopping
        temporaryDuration = recordingTime/100;
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
            showAfterButtons()
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

        // Add a flag to check if setup is complete before calling processInput
        scriptProcessor.onaudioprocess = processInput;

        // Initial empty render to ensure the canvas is ready
        renderBars(bars);
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

            // If the waveform exceeds the width, slice it
            if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
                renderBars(bars);
            } else {
                renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))));
            }

            waveformWidth = bars.length * (barWidth + barGutter);
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
        // Get the average volume from the frequency data array
        const average = array.reduce((sum, value) => sum + value, 0) / array.length;

        // Ensure the average volume is never below 1
        return Math.max(1, average);
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

                // Render all bars from the start based on the current bars array
                currentBars.forEach((bar, index) => {
                    canvasContext.fillStyle = barColor;
                    const x = (index * (barWidth + barGutter)) - canvasPositionX;
                    const barHeight = halfHeight * (bar / 100);

                    canvasContext.fillRect(x, halfHeight - barHeight, barWidth, barHeight);
                    canvasContext.fillRect(x, halfHeight, barWidth, barHeight);

                });

                // Render the static white line in the middle (playback bar)
                if (isPlaying) {
                    canvasContext.fillStyle = playbackBarColor; // White line color
                    const centerLineX = width / 2; // Center of the canvas
                    canvasContext.fillRect(centerLineX - 1, 0, 2, height); // Fixed white line in the center
                }

                drawing = false;
            });
        }
    }

    /**
     * Plays the audio recording.
     */

    function play() {
        console.log('Play button pressed');
        isPlaying = true;
        isPaused = false;
        audioPlayer.currentTime = 0;

        // Ensure waveform is rendered before playback starts
        renderBars(bars);
        canvasPositionX = 0; // Reset canvas position for first playback

        // Start playback only after rendering the waveform
        requestAnimationFrame(() => {
            audioPlayer.play();

            const updatePlaybackIndicator = () => {
                if (isPlaying) {
                    playbackTime = audioPlayer.currentTime;

                    if (audioPlayer.duration === Infinity) {
                        canvasPositionX = (playbackTime / temporaryDuration) * waveformWidth - width / 2;
                    } else {
                        canvasPositionX = (playbackTime / audioPlayer.duration) * waveformWidth - width / 2;
                    }

                    console.log(temporaryDuration);

                    renderBars(bars);

                    // Update the recording time display
                    recordingTime = playbackTime * 100;

                    requestAnimationFrame(updatePlaybackIndicator);
                }
            };

            updatePlaybackIndicator();
        });
    }


    /**
     * Stops the audio recording.
     */


    function stop() {
        console.log('Stopping playback');
        isPlaying = false;
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        renderBars(bars);
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
        canvasPositionX = 0;
        if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
            recorder.stop();
        }
        isRecording = false;
        isPaused = false;
        isPlaying = false;
        bars = [];
        renderBars(bars);
        recording = null;
        chunks = [];
        justCleared = true;
        justSaved = false;
        justStopped = false;
        // Reset the timer after clearing
        recordingTime = 0;
        stop();
        resetIndicatorStateLater();
        showBeforeButtons();
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
        // Round the hundredths to avoid floating-point precision issues
        hundredths = Math.round(hundredths);

        // Convert hundredths to seconds and minutes
        const totalSeconds = Math.floor(hundredths / 100);
        const h = hundredths % 100; // hundredths of a second
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;

        // Format time values to always be two digits
        const mm = m < 10 ? '0' + m : m;
        const ss = s < 10 ? '0' + s : s;
        const hh = h < 10 ? '0' + h : h;

        // Return the formatted time in MM:SS.hh format
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



    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('animated-btn').addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });


</script>
<div class="recorder-container" style="border: 0.3rem solid var(--clr-purple);">
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
        {:else if indicatorSymbol.type === 'saved'}
            <!-- Green checkmark -->
            <div class="icon saved">&#10004;</div>
        {:else if indicatorSymbol.type === 'stopped'}
            <!-- Red square -->
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
        <div class="waveform" id="waveform">
            <canvas
                    bind:this={canvas}
                    class="js-canvas waveform__canvas"
            ></canvas>
        </div>

        <div class="controls">

            <div
                    class="pulse-background"
                    style="display: {isRecording ? 'block' : 'none'}"
            ></div>

            <!-- Animated button -->
            <button
                    id="animated-btn"
                    class="{isRecording ? 'active' : ''}"
                    onclick={toggleRecording}
                    style="display: {isBeforeRecording ? 'block' : 'none'};">
                    <i id="microphone-icon" class="fas fa-microphone"></i>
            </button>

            <!-- Play and Pause buttons -->
            <div class="centered-buttons">
                <button
                        class="control-button pause-button"
                        onclick={pauseRecording}
                        style="display: {isRecording ? 'block' : 'none'};"
                >
                    <i class={isPaused ? 'fas fa-play' : 'fas fa-pause'}></i> {isPaused ? 'Resume' : 'Pause'}
                </button>
            </div>

            <!-- After Recording buttons -->
            <div class="centered-buttons after-recording">
                <button
                        class="control-button play-button"
                        class:disabled={!recording}
                        class:active={isPlaying}
                        onclick={togglePlay}
                        style="display: {isAfterRecording ? 'block' : 'none'};"
                >
                    <i class={isPlaying ? 'fas fa-stop' : 'fas fa-play'}></i> {isPlaying ? 'Stop' : 'Play'}
                </button>
                <button
                        class="control-button save-button gradient-border-button"
                        onclick={saveRecording}
                        disabled={!recording}
                        style="display: {isAfterRecording ? 'block' : 'none'};"
                >
                    <i class="fas fa-save"></i> Save
                </button>
                <button
                        class="control-button clear-button"
                        id="redo-button"
                        onclick={clearRecording}
                        disabled={isPlaying}
                        style="display: {isAfterRecording ? 'block' : 'none'};"
                >
                <i class="fas fa-redo"></i> Redo
                </button>
            </div>
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
        max-width: 700px;
        height: 30rem;
        margin: 0 auto 0;
        border-radius: 10px;
        position: relative; /* Needed for status-indicator positioning */
        transition: all 2.5s ease-in-out; /* Smooth transition for all properties */
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
        font-size: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* For recording: red blinking circle */
    .status-indicator.recording .icon.circle {
        width: 25px;
        height: 25px;
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
        width: 25px;
        height: 25px;
        background-color: red;
    }

    /* Green square for stoppedPlayback state */
    .status-indicator.stoppedPlaying .icon.stoppedPlaying {
        width: 25px;
        height: 25px;
        background-color: green;
    }

    /* Timer */
    .recording-time {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2rem;
        color: var(--crl-text);
    }


    .recorder-container :global(.gradient-border-button) {
        position: relative;
        background: transparent;
        z-index: 0;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
    }

    .recorder-container :global(.gradient-border-button::after) {
        content: '';
        position: absolute;
        inset: 2px;
        background: var(--clr-background);
        z-index: -1;
        border-radius: inherit;
    }

    .recorder-container :global(.gradient-border-button:hover::before) {
        background-position: 100% 0;
    }

    .control-button.disabled {
        opacity: 0.1;
        cursor: not-allowed;
    }

    .audio-recorder {
        width: 100%;
        padding: 2rem;
    }

    /* Waveform */
    .waveform {
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        height: 100px;
    }
    .waveform__canvas {
        width: 100%;
        height: 100%;
    }

    /* Controls */
    .controls {
        position: absolute;
        bottom: 20px;
        left: 50%;
        top: 75%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
    }

    /* Centered buttons */
    .centered-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    #animated-btn {
        margin: auto;
    }

    .centered-buttons.after-recording {
        display: flex;
        justify-content: center;
        gap: 1rem; /* Space between 'Play', 'Redo', and 'Save' */
    }

    /* Buttons */
    .control-button {
        padding: 1rem;
        border-radius: 10px;
        border: 3px solid var(--clr-text);
        cursor: pointer;
        background-color: var(--clr-background);
        color: var(--text-color);
        font-size: 1.6rem;
        transition:
                background-color var(--transition-delay) ease,
                color var(--transition-delay) ease,
                transform var(--transition-delay) ease;
    }
    .control-button:not(:disabled):hover {
        transform: scale(1.1);
        box-shadow: 0 0 5px 1px var(--clr-text);
        background-color: var(--clr-inverse);
        border: 3px solid var(--clr-inverse);
    }
    #redo-button:disabled {
        color: #666666;
        cursor: not-allowed;
        opacity: 0.3;
    }


    /* Button spacing and visibility tweaks for responsive design */
    @media screen and (max-width: 768px) {
        .controls {
            flex-direction: column;
        }
        .centered-buttons {
            flex-wrap: wrap;
        }
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

    .pulse-background {
        position: absolute;
        left: 50%;
        bottom: 120px;
        transform: translateX(-50%);
        width: 130px;
        height: 130px;
        background: rgba(150, 0, 255, 0.1); /* Pulse color */
        border-radius: 50%;
        animation: pulse 1.5s infinite ease-in-out;
        z-index: -1; /* Behind the button */
    }

    /* Animated button */
    #animated-btn {
        position: absolute;
        left: 50%;
        bottom: 120px;
        transform: translateX(-50%);
        width: 130px;
        height: 130px;
        border: none;
        background: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    /* Hover effect for button */
    #animated-btn:hover {
        transform: translateX(-50%) scale(1.1); /* Grow the button on hover without changing position */
    }

    #animated-btn:before {
        position: absolute;
        content: '';
        width: 130px;
        height: 130px;
        background: none;
        border-radius: 50%;
        top: 0;
        left: 0;
    }

    #animated-btn:after {
        position: absolute;
        content: '';
        width: 100px;
        height: 100px;
        background: var(--clr-border);
        border-radius: 50%;
        top: 15px;
        left: 15px;
        transition: all 0.3s ease;
    }

    #animated-btn.active:after {
        animation: stop 0.5s cubic-bezier(0.4, -0.9, 0.9, 1) 1 forwards;
    }

    #animated-btn.active #microphone-icon {
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.3s ease;
    }

    #microphone-icon {
        font-size: 2.5rem; /* Adjust the size as needed */
        color: var(--clr-ideal); /* Use your theme's text color */
        z-index: 1; /* Ensure the icon appears above the animations */
        position: relative; /* To prevent it from inheriting absolute positioning from the parent */
    }


    #animated-btn.active #microphone-icon {
        opacity: 0;
        transform: scale(0.5); /* Shrink the icon as it disappears */
    }

    /* Keyframes for button animation */
    @keyframes stop {
        70% {
            border-radius: 6px;
            width: 60px;
            height: 60px;
            top: 35px;
            left: 35px;
        }
        100% {
            border-radius: 6px;
            width: 64px;
            height: 64px;
            top: 33px;
            left: 33px;
        }
    }

    /* Keyframes for pulse animation */
    @keyframes pulse {
        0% {
            transform: translateX(-50%) scale(0.1);
            opacity: 1;
        }
        50% {
            transform: translateX(-50%) scale(0.9);
            opacity: 0.9;
        }
        100% {
            transform: translateX(-50%) scale(1.2);
            opacity: 0;
        }
    }


</style>