<script>
    import { getContext } from 'svelte';
    import FeedbackModal from "./FeedbackModal.svelte";
    const { open } = getContext('simple-modal');
    const {onRecordingSaved, onTextFeedbackSaved} = $props();


    const showModal = () => {
        open(FeedbackModal, { onRecordingSaved, onTextFeedbackSaved });
    };
</script>

<button class="gradient-border-button" onclick={showModal}>New feedback</button>