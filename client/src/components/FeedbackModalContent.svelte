<script>
    import { getContext } from 'svelte';
    import FeedbackModal from "./FeedbackModal.svelte";
    const { open } = getContext('simple-modal');
    const {onRecordingSaved, onTextFeedbackSaved, onVideoSaved } = $props();


    const showModal = () => {
        open(FeedbackModal, { onRecordingSaved, onTextFeedbackSaved, onVideoSaved });
    };
</script>

<button class="addnew-button gradient-border-button" onclick={showModal}>New feedback</button>

<style>

    .addnew-button {
        position: relative;
        font-weight: 600;
        color: var(--clr-text);
        padding: 1rem;
        width: 40%;  /* Button width is 40% of the screen width */
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease,
        transform 0.2s ease; /* Added transition for scaling */
        margin-left: auto;
        margin-right: auto;
        font-size: calc(var(--container-width) / var(--factor));
    }

    .addnew-button:hover {
        color: var(--clr-text);
        transform: scale(1.03); /* Button will grow by 5% */
    }

    @media screen and (max-width: 300px){
        .addnew-button{
            font-size: 0.75rem;
        }
    }

</style>