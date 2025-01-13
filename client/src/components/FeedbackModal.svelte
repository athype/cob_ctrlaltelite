<script>
    import AudioRecorder from "./AudioRecorder.svelte";
    import TextRecorder from "./TextRecorder.svelte";

    const {onRecordingSaved, onTextFeedbackSaved} = $props();
</script>

<div class="modal-container">
    <AudioRecorder {onRecordingSaved}/>
    <div class="divider"></div>
    <TextRecorder {onTextFeedbackSaved}/>
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