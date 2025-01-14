<script>
    import AudioRecorder from "./AudioRecorder.svelte";
    import TextRecorder from "./TextRecorder.svelte";
    import VideoRecorder from "./VideoRecorder.svelte";
    import { crossfade } from 'svelte/transition';

    const {onRecordingSaved, onTextFeedbackSaved, onVideoSaved} = $props();

    let activeRecorder = $state('');

    const [send, receive] = crossfade({
        duration: 150
    });

    function switchRecorder(type) {
        activeRecorder = activeRecorder === type ? '' : type;
    }
</script>

<div class="modal-container">
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
                <AudioRecorder {onRecordingSaved}/>
            </div>
        {/if}

        {#if activeRecorder === 'text'}
            <div
                    class="recorder-wrapper"
                    in:receive={{key: 'recorder'}}
                    out:send={{key: 'recorder'}}
            >
                <TextRecorder {onTextFeedbackSaved}/>
            </div>
        {/if}

        {#if activeRecorder === 'video'}
            <div
                    class="recorder-wrapper"
                    in:receive={{key: 'recorder'}}
                    out:send={{key: 'recorder'}}
            >
                <VideoRecorder {onVideoSaved}/>
            </div>
        {/if}
    </div>
</div>

<style>
    .modal-container {
        min-height: 400px;
        display: flex;
        flex-direction: column;
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
        min-height: 300px;
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
        display: flex; /* Ensure flexbox is used for vertical alignment */
        justify-content: center;
        align-items: center;
        border-bottom: none;
        transform: translateY(-2px);
        margin-left: 0.2rem;
        margin-right: 0.2rem;
    }

    .feedback-toolbar button div {
        display: inline-block; /* Prevent text from being affected by transform */
    }

    /* Hover effect */
    .feedback-toolbar button:hover {
        color: var(--clr-highlight);
        border-color: var(--clr-border);
        border: dashed;
        border-bottom: none;
        transform: translateY(-4px); /* Move the button up slightly when hovered */
    }

    /* Active state */
    .feedback-toolbar button.active {
        background-color: var(--clr-highlight);
        color: var(--clr-text-active);
        border: 0.225rem solid var(--clr-border);
        transform: translateY(-8px); /* Move the button up more when active */
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

</style>