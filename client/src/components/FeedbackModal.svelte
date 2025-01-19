<script>
    import AudioRecorder from "./AudioRecorder.svelte";
    import TextRecorder from "./TextRecorder.svelte";
    import VideoRecorder from "./VideoRecorder.svelte";
    import AlertModal from "./AlertModal.svelte";
    import { crossfade } from 'svelte/transition';

    const {onRecordingSaved, onTextFeedbackSaved, onVideoSaved} = $props();

    let modalDisplay = $state(false);
    let modalMessage = "";

    export function closeModal() {
        modalDisplay = false;
    };

    function showModal(message) {
        modalDisplay = true;
        modalMessage = message;

        setTimeout(() => {
            modalDisplay = false;
        }, 1500);
    }

    let activeRecorder = $state('text');

    const [send, receive] = crossfade({
        duration: 150
    });

    function switchRecorder(type) {
        activeRecorder = activeRecorder === type ? '' : type;
    }
</script>

{#if modalDisplay}
    <AlertModal message={modalMessage} closeModal={closeModal}/>
{/if}

<div class="modal-container">
    <h2 class="title">Create Feedback</h2>
    <div class="feedback-toolbar">
        <button
                class="text-tab"
                class:active={activeRecorder === 'text'}
                onclick={() => switchRecorder('text')}
        >
            Text
        </button>
        <button
                class="audio-tab"
                class:active={activeRecorder === 'audio'}
                onclick={() => switchRecorder('audio')}
        >
            Audio
        </button>
        <button
                class="video-tab"
                class:active={activeRecorder === 'video'}
                onclick={() => switchRecorder('video')}
        >
            Video
        </button>
    </div>

    <div class="content-container">


        {#if activeRecorder === 'audio'}
            <div
                    class="recorder-wrapper"
                    in:receive={{key: 'recorder'}}
                    out:send={{key: 'recorder'}}
            >
                <AudioRecorder {onRecordingSaved} {showModal}/>
            </div>
        {/if}

        {#if activeRecorder === 'text'}
            <div
                    class="recorder-wrapper"
                    in:receive={{key: 'recorder'}}
                    out:send={{key: 'recorder'}}
            >
                <TextRecorder {onTextFeedbackSaved} {showModal}/>
            </div>
        {/if}

        {#if activeRecorder === 'video'}
            <div
                    class="recorder-wrapper"
                    in:receive={{key: 'recorder'}}
                    out:send={{key: 'recorder'}}
            >
                <VideoRecorder {onVideoSaved} {showModal}/>
            </div>
        {/if}
    </div>
</div>

<style>
    .modal-container {
        min-height: 400px;
        display: flex;
        flex-direction: column;
        overflow: revert;
        max-height: 90vh;
    }

    .feedback-toolbar {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-top: 2rem;
    }

    .content-container {
        position: relative;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        min-height: 450px;
        margin-bottom: 7rem;
    }

    .recorder-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .feedback-toolbar button {
        flex-grow: 1;
        font-weight: 600;
        text-align: center;
        color: var(--clr-text);
        border: dashed;
        border-radius: 0.5rem 0.5rem 0 0;
        cursor: pointer;
        transition: transform 0.3s ease, border-color 0.3s, background-color 0.3s, color 0.3s;
        padding: 1rem;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: none;
        transform: translateY(-2px);
        margin-left: 0.2rem;
        margin-right: 0.2rem;
    }

    .feedback-toolbar button div {
        display: inline-block;
    }

    /* Hover effect */
    .feedback-toolbar button:hover {
        color: var(--clr-highlight);
        border-color: var(--clr-border);
        border: dashed;
        border-bottom: none;
        transform: translateY(-4px);
    }

    /* Active state */
    .feedback-toolbar button.active {
        background-color: var(--clr-highlight);
        color: var(--clr-text-active);
        border: 0.225rem solid var(--clr-border);
        transform: translateY(-8px);
        font-size: 17px;
        z-index: 1;
    }


    .feedback-toolbar .text-tab.active {
        border-color: var(--clr-pink);
    }

    .feedback-toolbar .audio-tab.active {
        border-color: var(--clr-purple);
    }

    .feedback-toolbar .video-tab.active {
        border-color: var(--clr-indigo);
    }

    .title {
        font-size: 1.8rem;
        font-weight: 600;
        text-align: center;
    }

</style>