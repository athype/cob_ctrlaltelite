<script>
    import ThemeSwitch from "../components/ThemeSwitch.svelte";
    import FeedbackTabs from "../components/FeedbackTabs.svelte";
    import { writable } from 'svelte/store';

    import Modal, { bind } from 'svelte-simple-modal';
    import FeedbackModalContent from "../components/FeedbackModalContent.svelte";

    let recordings = $state(writable([]));
    let videos = $state(writable([]));
    let texts = $state(writable([]));

    let {onTextFeedbackSaved} = $props();

    $effect(() => {
        fetchFeedback();
    });

    /**
     * Fetches both audio and text feedback from backend api via await.
     */
    async function fetchFeedback() {
        try {
            const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
            if (recordingsResponse.ok) {
                recordings = await recordingsResponse.json();
            } else if (recordingsResponse.status === 404) {
                console.warn('No audio feedback found.');
            } else {
                console.error('Failed to fetch audio feedback:', await recordingsResponse.text());
            }

            const textsResponse = await fetch('http://localhost:3000/text-feedback');
            if (textsResponse.ok) {
                texts = await textsResponse.json();
            } else {
                console.error('Failed to fetch text feedback:', await textsResponse.text());
            }

            const videosResponse = await fetch('http://localhost:3000/video-feedback');
            if (videosResponse.ok) {
                videos = await videosResponse.json();
            } else {
                console.error('Failed to fetch video feedback:', await videosResponse.text());
            }

        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    }

</script>

<ThemeSwitch/>

<main class="container">
    <Modal
            styleWindow={{
            backgroundColor: 'var(--clr-background)',
            color: 'var(--clr-text)',
            border: '3px solid var(--clr-border)',
            transition: 'all var(--transition-delay) ease-in-out',
            padding: '20px',
            height: '40rem',
            width: '50rem',
            borderRadius: '10px',
            overflow: 'hidden'
        }}
            styleContent={{overflow: 'hidden'}}
    >
        <FeedbackModalContent onRecordingSaved={fetchFeedback} onTextFeedbackSaved={fetchFeedback} onVideoSaved={fetchFeedback}/>
    </Modal>

    <FeedbackTabs {texts} {recordings} {videos} onTextFeedbackSaved={fetchFeedback}/>
</main>

<style>

    .container{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
    }

    .container h1 {
        font-size: 1.75rem;
        margin-top: 3vh;
    }

    header h2 {
        color: var(--clr-text);
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }

    .send-button {
        background-color: var(--clr-background);
        border: 3px solid var(--clr-border);
        color: var(--clr-text);
        padding: 1rem;
        width: 20rem;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
    }

    .send-button:hover {
        box-shadow: 0 0 0.3125rem 0.0625rem var(--clr-purple);
        color: var(--clr-background);
    }

    .saved-button {
        background-color: green !important;
        color: white !important;
    }

    textarea {
        padding: 1rem;
        min-height: 10vh;
        border-radius: 4px;
        background-color: var(--clr-background);
        padding: 0.5rem;
        border-radius: 0.25rem;
        color: var(--clr-text);
        border: 3px solid var(--clr-border);
    }


    .error {
        color: red;
        font-size: 0.9rem;
        margin-top: -1rem;
    }

</style>