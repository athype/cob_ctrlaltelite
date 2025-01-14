<script>
    import AudioRecorder from "./AudioRecorder.svelte";
    import TextRecorder from "./TextRecorder.svelte";
    import VideoRecorder from "./VideoRecorder.svelte";
    import AlertModal from "./AlertModal.svelte";

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
</script>

{#if modalDisplay}
    <AlertModal message={modalMessage} closeModal={closeModal}/>
{/if}

<div class="modal-container">
    <AudioRecorder {onRecordingSaved} {showModal}/>
    <div class="divider"></div>
    <TextRecorder {onTextFeedbackSaved} {showModal}/>
    <div class="divider"></div>
    <VideoRecorder {onVideoSaved} {showModal}/>
</div>

<style>
    .modal-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .divider {
        width: 100%;
        margin-top: 2rem;
    }
</style>