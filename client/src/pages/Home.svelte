<script>
    import TitleInputField from "../components/TitleInputField.svelte";
    import ThemeSwitch from "../components/ThemeSwitch.svelte";
    import FeedbackTabs from "../components/FeedbackTabs.svelte";
    import TextRecorder from "../components/TextRecorder.svelte";

    import Modal, { bind } from 'svelte-simple-modal';
    import FeedbackModalContent from "../components/FeedbackModalContent.svelte";
    import {writable} from "svelte/store";
    import AlertModal from "../components/AlertModal.svelte";


    // Declare reactive variables
    let feedbackText = $state('');
    let recordings = $state([]);
    let videos = $state([]);
    let texts = $state([]);
    let selectedFeedback = $state(null);
    let textFeedbackTitle = $state('');
    let showTranscription = $state(false);

    // New state variables for validation and feedback
    let titleError = $state(false);
    let feedbackError = $state(false);
    let feedbackSaved = $state(false); // To track if feedback was successfully saved

    const modal = writable(null);

    // For some reason it throws an IDE error, even though it works fine
    const showModal = (message) => modal.set(bind(AlertModal, { message: message }));
    /*Place the following line to any code you want to display the modal
    * showModal("You selected something!");
    * this activates the modal that only has show modal in it
    * it also for some reason throws a reactivity warning in browser console, but it works fine
    * */


    // Side effect that runs whenever a reactive variable changes, also polling backend for feedback
    $effect(() => {
        fetchFeedback();
    });

    /**
     * Fetches both audio and text feedback from backend api via await.
     */
    async function fetchFeedback() {
        try {
            // Fetch audio feedback
            const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
            if (recordingsResponse.ok) {
                recordings = await recordingsResponse.json();
            } else if (recordingsResponse.status === 404) {
                console.warn('No audio feedback found.');
                recordings = [];
            } else {
                console.error('Failed to fetch audio feedback:', await recordingsResponse.text());
            }

            // Fetch text feedback
            const textsResponse = await fetch('http://localhost:3000/text-feedback');
            if (textsResponse.ok) {
                texts = await textsResponse.json();
            } else {
                console.error('Failed to fetch text feedback:', await textsResponse.text());
            }

            // Fetch video feedback
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

    /**
     * Sends text feedback to the db.
     * @param text_feedback
     */
    async function saveTextFeedback(text_feedback) {
        try {
            const response = await fetch('http://localhost:3000/text_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedback_text: text_feedback,
                    name: textFeedbackTitle
                }),
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Text feedback saved successfully:', result);
                feedbackText = '';
                textFeedbackTitle = '';
                feedbackSaved = true;
                await fetchFeedback();
            } else {
                console.error('Failed to save text:', await response.text());
            }
        } catch (error) {
            console.error('Error saving text:', error);
        }
    }

    /**
     * Handler function that calls save function.
     */
    function handleSend() {
        // Reset errors first
        titleError = false;
        feedbackError = false;

        // Check if title or feedback text are empty
        if (!textFeedbackTitle.trim()) {
            titleError = true;
        }
        if (!feedbackText.trim()) {
            feedbackError = true;
        }

        // If either error is true, don't save
        if (titleError || feedbackError) {
            return;
        }

        // Proceed to save if no errors
        saveTextFeedback(feedbackText);
    }

    async function handleTranscriptionClick() {
        showTranscription = true;
    }

    // Effect that resets the "Feedback Saved" state when the user starts typing again
    $effect(() => {
        if (textFeedbackTitle || feedbackText) {
            feedbackSaved = false;
            // Reset errors if user typed something non-empty
            if (textFeedbackTitle.trim()) {
                titleError = false;
            }
            if (feedbackText.trim()) {
                feedbackError = false;
            }
        }
    });
</script>

<ThemeSwitch/>
<Modal
        show={$modal}
>
</Modal>

<main class="container">

    <Modal
            styleWindow={{backgroundColor: 'var(--clr-background)',
                      color: 'var(--clr-text)',
                      border:'3px solid var(--clr-border)'}}
    > <FeedbackModalContent onRecordingSaved={fetchFeedback} onTextFeedbackSaved={fetchFeedback}/> </Modal>

    <button class="addnew-button gradient-border-button">Create New Feedback</button>
    <FeedbackTabs {texts} {recordings} {videos}/>
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

    .addnew-button {
        position: relative;
        font-size: 1.4rem;
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
    }

    .addnew-button:hover {
        color: var(--clr-text);
        transform: scale(1.03); /* Button will grow by 5% */
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
        /*border-top-width: 1px;*/
    }


    .error {
        color: red;
        font-size: 0.9rem;
        margin-top: -1rem; /* Adjust if needed */
    }
</style>