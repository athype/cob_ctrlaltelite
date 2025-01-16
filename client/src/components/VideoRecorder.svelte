<script lang="ts">
    import { onMount } from 'svelte';

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


    // Access webcam and initialize stream
    async function startVideoStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoElement) {
                videoElement.srcObject = stream;
            }

            // Set up MediaRecorder
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.onstart = () => {
                recordingStartTime = Date.now(); // Record the start time in milliseconds
                recordedChunks = []; // Clear previous recordings
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

                    if (saveButton) saveButton.disabled = false; // Enable Save Video button
                } else {
                    alert('No data recorded.');
                }
            };
        } catch (error) {
            alert('Unable to access webcam. Please check your permissions.');
            console.error('Error accessing webcam:', error);
        }
    }

    async function saveVideo() {
        if (!recordedChunks.length) {
            alert('No video to save.');
            return;
        }

        if (recordingDuration !== null && recordingDuration < 1) {
            alert('Video is too short. Please record a video longer than 1 second.');
            return;
        }

        // Ask the user for a video name
        const videoName = prompt("Enter a name for the video:", "recorded-video");

        if (!videoName) {
            alert("Video name is required!");
            return;
        }

        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Prepare form data
        const formData = new FormData();
        formData.append('video', blob, `${videoName}.webm`); // Use the video name
        formData.append('name', videoName); // Add video name to the form data
        formData.append('duration', recordingDuration.toString()); // Add duration to the form data

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


    // Method to toggle between camera and output sections
    function showCameraSection() {
        isCameraSectionVisible = true;
        isOutputSectionVisible = false;
    }

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

        if (saveButton) saveButton.disabled = true; // Disable Save button initially

        // Start recording
        startButton?.addEventListener('click', () => {
            if (mediaRecorder) {
                recordedChunks = []; // Clear previous recordings
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
                showOutputSection(); // Show the output section
            }
        });


        // Redo video recording
        document.getElementById('redo-btn')?.addEventListener('click', () => {
            showCameraSection(); // Show the camera section
        });

        // Save video
        saveButton?.addEventListener('click', saveVideo);

        // Initialize the video stream
        startVideoStream();
    });

</script>

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
                <button id="redo-btn" class="gradient-border-button"> <i class="fas fa-redo"></i> Redo Video</button>
                <button id="save-btn" class="gradient-border-button"> <i class="fas fa-save"></i> Save Video</button>
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
        border-radius: 10px;
        background: var(--clr-background);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
        border-radius: 10px;
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
        border-radius: 10px;
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
        padding: 10px 20px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 10px;
        margin: 0 5px;
        transition: background 0.3s ease;
    }

    .gradient-border-button::before {
        content: '';
        position: absolute;
        inset: -2px;
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


    @media (max-width: 600px) {
        .gradient-border-button {
            padding: 4px 7px;  /* Make buttons smaller on smaller screens */
            font-size: 0.9rem;   /* Adjust font size for better readability */
        }

        .video-section video {
            width: 90%;  /* Adjust the video size for mobile */
        }

        .recorder-container {
            padding: 0.5rem;  /* Adjust padding on smaller screens */
        }
    }


</style>