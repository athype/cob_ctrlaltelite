<script lang="ts">
    import { onMount } from 'svelte';
    import NameInputModal from "./NameInputModal.svelte";

    let videoElement: HTMLVideoElement | null = null;
    let startButton: HTMLButtonElement | null = null;
    let stopButton: HTMLButtonElement | null = null;
    let saveButton: HTMLButtonElement | null = null;
    let recordedVideoElement: HTMLVideoElement | null = null;

    const {onVideoSaved, showModal} = $props();

    let mediaRecorder: MediaRecorder;
    let recordedChunks: BlobPart[] = [];

    let recordingDuration: number | null = null;
    let recordingStartTime: number | null = null;

    let isCameraSectionVisible = $state(true);
    let isOutputSectionVisible = $state(false);

    let nameInputModalDisplay = $state(false);
    let nameInputModalMessage = $state("");

    /**
     * Access webcam and initialize stream
     */
    async function startVideoStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoElement) {
                videoElement.srcObject = stream;
            }

            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.onstart = () => {
                recordingStartTime = Date.now();
                recordedChunks = [];
                console.log("Recording started at:", recordingStartTime);
            };

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const recordingEndTime = Date.now();
                console.log("Recorded chunks:", recordedChunks);
                recordingDuration = (recordingEndTime - (recordingStartTime || recordingEndTime)) / 1000;
                if (recordedChunks.length > 0) {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const videoURL = URL.createObjectURL(blob);

                    if (recordedVideoElement) {
                        recordedVideoElement.src = videoURL;
                        recordedVideoElement.load();
                        recordedVideoElement.play();
                    }

                    if (saveButton) saveButton.disabled = false;
                } else {
                    alert('No data recorded.');
                }
            };
        } catch (error) {
            alert('Unable to access webcam. Please check your permissions.');
            console.error('Error accessing webcam:', error);
        }
    }

    /**
     * Saves the recorded video to the server
     * @param videoName
     */
    async function saveVideo(videoName) {
        if (!recordedChunks.length) {
            alert('No video to save.');
            return;
        }

        if (recordingDuration !== null && recordingDuration < 1) {
            alert('Video is too short. Please record a video longer than 1 second.');
            return;
        }

        if (!videoName) {
            alert("Video name is required!");
            return;
        }

        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        const formData = new FormData();
        formData.append('video', blob, `${videoName}.webm`);
        formData.append('name', videoName);
        formData.append('duration', recordingDuration.toString());

        console.log('Saving video...', formData);

        try {
            const response = await fetch(`http://localhost:3000/upload-video`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log(await response.json());
                onVideoSaved?.();
                showModal?.("Success!");
            } else {
                console.error(await response.text());
                showModal?.("Failure :(");
            }
        } catch (error) {
            console.error('Save video error:', error);
            alert('An error occurred.');
        }
    }

    /**
     * Saves the video with the given name
     * @param name
     */
    function onNameInputSaveClick(name) {
        saveVideo(name);
        nameInputModalDisplay = false;
    }

    /**
     * Method to toggle between camera and output sections
     */
    function showCameraSection() {
        isCameraSectionVisible = true;
        isOutputSectionVisible = false;
    }

    /**
     * Method to toggle between camera and output sections
     */
    function showOutputSection() {
        isCameraSectionVisible = false;
        isOutputSectionVisible = true;
    }

    onMount(() => {
        videoElement = document.getElementById('video') as HTMLVideoElement;
        startButton = document.getElementById('start-btn') as HTMLButtonElement;
        stopButton = document.getElementById('stop-btn') as HTMLButtonElement;
        saveButton = document.getElementById('save-btn') as HTMLButtonElement;
        recordedVideoElement = document.getElementById('recorded-video') as HTMLVideoElement;

        if (saveButton) saveButton.disabled = true;

        // Start recording
        startButton?.addEventListener('click', () => {
            if (mediaRecorder) {
                recordedChunks = [];
                mediaRecorder.start();
                if (startButton && stopButton) {
                    startButton.disabled = true;
                    stopButton.disabled = false;
                }
            }
        });

        // Stop recording and toggle visibility
        stopButton?.addEventListener('click', () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
                if (startButton && stopButton) {
                    startButton.disabled = false;
                    stopButton.disabled = true;
                }
                showOutputSection();
            }
        });

        // Redo video recording
        document.getElementById('redo-btn')?.addEventListener('click', () => {
            showCameraSection();
        });

        saveButton?.addEventListener('click', showNameInputModal);

        startVideoStream();
    });

    /**
     * Closes the name input modal
     */
    function closeNameInputModal() {
        nameInputModalDisplay = false;
    }

    /**
     * Shows the name input modal
     */
    function showNameInputModal() {
        nameInputModalDisplay = true;
    }
</script>

{#if nameInputModalDisplay}
    <NameInputModal closeModal={closeNameInputModal} handleSaveButtonClick={onNameInputSaveClick} name={nameInputModalMessage}/>
{/if}

<div class="recorder-container" style="border: 0.3rem solid var(--clr-indigo);">
    <div class="content">
        <div class="camera-section" style="display: {isCameraSectionVisible ? 'block' : 'none'};">
            <h2 class="title">Camera</h2>
            <div class="video-section">
                <video id="video" autoplay muted playsinline></video>
            </div>
            <div class="controls">
                <button id="start-btn" class="gradient-border-button">Start Recording</button>
                <button id="stop-btn" class="gradient-border-button" disabled>Stop Recording</button>
            </div>
        </div>

        <div class="output-section" style="display: {isOutputSectionVisible ? 'block' : 'none'};">
            <h2 class="title">Preview</h2>
            <div class="video-section">
                <video id="recorded-video" controls></video>
            </div>
            <div class="controls">
                <button id="redo-btn" class="gradient-border-button">Redo Video</button>
                <button id="save-btn" class="gradient-border-button">Save Video</button>
            </div>
        </div>

    </div>
</div>

<style>

    body {
        margin: 0;
        padding: 0;
        background: var(--clr-background);
        color: var(--clr-text);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .recorder-container {
        width: 100%;
        height: 120%;
        max-width: 600vw;
        padding: 1.5rem;
        border-radius: 0.625rem;
        background: var(--clr-background);
        box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        width: 100%;
    }

    .camera-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .video-section {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .video-section video {
        width: 95%;
        height: auto;
        max-width: 100%;
        border-radius: 0.625rem;
        margin-bottom: 1rem;
    }

    .controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }

    .output-section {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .output-section video {
        width: 95%;
        border-radius: 0.625rem;
        margin-bottom: 1rem;
    }

    .title {
        font-size: 1.8rem;
        padding: 0.5rem;
        font-weight: 600;
    }

    .gradient-border-button {
        position: relative;
        background: transparent;
        color: var(--crl-text);
        z-index: 0;
        border: none;
        padding: 0.625rem 1.25rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 0.625rem;
        margin: 0 0.313rem;
        transition: background 0.3s ease;
    }

    .gradient-border-button::before {
        content: '';
        position: absolute;
        inset: -0.125rem;
        background: linear-gradient(90deg, var(--clr-pink), var(--clr-dark-blue), var(--clr-cyan), var(--clr-pink));
        background-size: 200% 100%;
        z-index: -1;
        border-radius: inherit;
        transition: background-position 0.5s ease;
    }

    .gradient-border-button:hover::before {
        background-position: 100% 0;
    }

    .gradient-border-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    @media (max-width: 37.5rem) {
        .gradient-border-button {
            padding: 0.25rem 0.438rem;
            font-size: 0.9rem;
        }

        .video-section video {
            width: 90%;
        }

        .recorder-container {
            padding: 0.5rem;
        }
    }

</style>