<script lang="ts">
    import { onMount } from 'svelte';

    let videoElement: HTMLVideoElement | null = null;
    let startButton: HTMLButtonElement | null = null;
    let stopButton: HTMLButtonElement | null = null;
    let recordedVideoElement: HTMLVideoElement | null = null;
    let downloadLink: HTMLAnchorElement | null = null;

    let mediaRecorder: MediaRecorder;
    let recordedChunks: BlobPart[] = [];

    // Access webcam and initialize stream
    async function startVideoStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoElement) {
                videoElement.srcObject = stream;
            }

            // Set up MediaRecorder
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const videoURL = URL.createObjectURL(blob);
                if (recordedVideoElement && downloadLink) {
                    recordedVideoElement.src = videoURL;
                    downloadLink.href = videoURL;
                    downloadLink.style.display = 'inline-block';
                }
            };
        } catch (error) {
            alert('Unable to access webcam. Please check your permissions.');
            console.error('Error accessing webcam:', error);
        }
    }

    onMount(() => {
        videoElement = document.getElementById('video') as HTMLVideoElement;
        startButton = document.getElementById('start-btn') as HTMLButtonElement;
        stopButton = document.getElementById('stop-btn') as HTMLButtonElement;
        recordedVideoElement = document.getElementById('recorded-video') as HTMLVideoElement;
        downloadLink = document.getElementById('download-link') as HTMLAnchorElement;

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

        // Stop recording
        stopButton?.addEventListener('click', () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
                if (startButton && stopButton) {
                    startButton.disabled = false;
                    stopButton.disabled = true;
                }
            }
        });

        // Initialize the video stream
        startVideoStream();
    });
</script>


<div class="recorder-container gradient-border">
    <h1>Video Recorder</h1>

    <div class="content">
        <!-- Camera Section -->
        <div class="camera-section">
            <div class="video-section">
                <h2>Preview</h2>
                <video id="video" autoplay muted playsinline></video>
            </div>
            <div class="controls">
                <button id="start-btn" class="gradient-border-button">Start Recording</button>
                <button id="stop-btn" class="gradient-border-button" disabled>Stop Recording</button>
            </div>
        </div>

        <!-- Output Section -->
        <div class="output-section">
            <h2>Recorded Video</h2>
            <video id="recorded-video" controls></video>
            <a id="download-link" download="recorded-video.webm" class="download-btn">Download Video</a>
        </div>
    </div>
</div>



<style>

    body {
        margin: 0;
        padding: 0;
        background: #121212;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .recorder-container {
        width: 100%;
        max-width: 600vw;
        padding: 1.5rem;
        border-radius: 10px;
        background: #222;
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

    .video-section video {
        width: 100%;
        max-width: 450px;
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
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .output-section video {
        width: 100%;
        max-width: 600px;
        border-radius: 10px;
        margin-bottom: 1rem;
    }

    .download-btn {
        display: none;
        margin-top: 1rem;
        text-decoration: none;
        color: var(--clr-cyan);
        font-weight: bold;
    }

    .download-btn:hover {
        color: var(--clr-pink);
    }




    h1, h2 {
        margin-bottom: 1rem;
        color: white;
    }





    .gradient-border-button {
        position: relative;
        background: transparent;
        color: #fff;
        z-index: 0;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 30px;
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

</style>