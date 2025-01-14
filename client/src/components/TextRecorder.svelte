<script>
    import TitleInputField from "./TitleInputField.svelte";

    let feedbackText = $state('');
    let textFeedbackTitle = $state('');

    // New state variables for validation and feedback
    let titleError = $state(false);
    let feedbackError = $state(false);
    let feedbackSaved = $state(false); // To track if feedback was successfully

    const {onTextFeedbackSaved} = $props();

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
                onTextFeedbackSaved?.();
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

<section class="text-recorder gradient-border">
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

    <!-- Change button style based on feedbackSaved state -->
    <button
            on:click={handleSend}
            class={`send-button ${feedbackSaved ? 'saved-button' : ''}`}
    >
        {feedbackSaved ? 'Feedback Saved' : 'Save Text Feedback'}
    </button>
</section>

<style>
    .text-recorder {
        padding: 1.5rem;
        gap: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .saved-button {
        background-color: green !important;
        color: white !important;
    }

    .error {
        color: red;
        font-size: 0.9rem;
        margin-top: -1rem; /* Adjust if needed */
    }

    textarea {
        padding: 1rem;
        min-height: 10vh;
        border-radius: 4px;
        width: 100%;
        background-color: var(--clr-background);
        color: var(--clr-text);
        border: 3px solid var(--clr-border);
        /*border-top-width: 1px;*/
    }

    .send-button {
        background-color: var(--clr-background);
        border: 3px solid var(--clr-border);
        color: var(--clr-text);
        padding: 1rem;
        max-width: 20rem;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
    }

    .send-button:hover {
        box-shadow: 0 0 0.3125rem 0.0625rem var(--clr-purple);
        color: var(--clr-background);
    }
</style>