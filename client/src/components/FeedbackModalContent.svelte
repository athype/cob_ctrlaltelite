<script>
    import { getContext } from 'svelte';
    import FeedbackModal from "./FeedbackModal.svelte";
    const { open } = getContext('simple-modal');
    const {onRecordingSaved, onTextFeedbackSaved, onVideoSaved } = $props();


    const showModal = () => {
        open(FeedbackModal, { onRecordingSaved, onTextFeedbackSaved, onVideoSaved });
    };
</script>

<button class="addnew-button gradient-border-button" onclick={showModal}>New feedback <i class="fa-solid fa-pen-to-square"></i></button>

<style>

    .addnew-button {
        position: relative;
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--clr-text);
        padding: 1rem;
        width: 40%;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease,
        transform 0.2s ease;
        margin-left: auto;
        margin-right: auto;
    }

    .addnew-button:hover {
        color: var(--clr-text);
        transform: scale(1.03);
    }


</style>