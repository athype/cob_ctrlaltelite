<script>
    import AudioRecorder from "../components/AudioRecorder.svelte";
    import TitleInputField from "../components/TitleInputField.svelte";
    import ThemeSwitch from "../components/ThemeSwitch.svelte";
    import FeedbackTabs from "../components/FeedbackTabs.svelte";

    let feedbackText = $state('');
    let recordings = $state([]);
    let texts = $state([]);
    let textFeedbackTitle = $state('');

    // New state variables for validation and feedback
    let titleError = $state(false);
    let feedbackError = $state(false);
    let feedbackSaved = $state(false);

    function handleFeedbackUpdated(event) {
        recordings = event.detail.recordings;
        texts = event.detail.texts;
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
                feedbackText = '';
                textFeedbackTitle = '';
                feedbackSaved = true;
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
        titleError = !textFeedbackTitle.trim();
        feedbackError = !feedbackText.trim();

        if (!titleError && !feedbackError) {
            saveTextFeedback(feedbackText);
        }
    }
</script>

<ThemeSwitch/>

<main class="container">
    <button class="addnew-button gradient-border-button">Add new feedback</button>

    <!-- Listen for the feedbackUpdated event -->
    <FeedbackTabs on:feedbackUpdated={handleFeedbackUpdated}/>

    <h1>Add Feedback</h1>
    <section class="feedback-input">
        <AudioRecorder />
        <TitleInputField bind:title={textFeedbackTitle}/>
        {#if titleError}
            <p class="error">Title is required</p>
        {/if}

        <textarea
                bind:value={feedbackText}
                placeholder="Type your feedback here..."
                rows="3"
        ></textarea>
        {#if feedbackError}
            <p class="error">Feedback text is required</p>
        {/if}

        <button
                on:click={handleSend}
                class={`send-button ${feedbackSaved ? 'saved-button' : ''}`}
        >
            {feedbackSaved ? 'Feedback Saved' : 'Save Text Feedback'}
        </button>
    </section>
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

    .feedback-input {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 2rem;
    }

    .addnew-button {
        position: relative;
        border: 3px;
        color: var(--clr-text);
        padding: 1rem;
        width: 20rem;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
        margin-left: auto;
        margin-right: auto;
    }

    .addnew-button:hover {
        background: linear-gradient(90deg, var(--clr-cyan) 0%, var(--clr-purple) 35%, var(--clr-pink) 100%);
        color: var(--clr-text);
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