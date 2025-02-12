<script>
    import TitleInputField from "./TitleInputField.svelte";

    let feedbackText = $state('');
    let textFeedbackTitle = $state('');

    let titleError = $state(false);
    let feedbackError = $state(false);
    let feedbackSaved = $state(false);

    const {onTextFeedbackSaved, showModal} = $props();

    /**
     * Sends text feedback to the db.
     * @param text_feedback
     */
    async function saveTextFeedback(text_feedback) {
        try {
            const response = await fetch('http://localhost:3000/text-feedback', {
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
                showModal?.("Success!");
                onTextFeedbackSaved?.();
            } else {
                showModal?.("Text feedback failed to save");
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
        titleError = false;
        feedbackError = false;

        if (!textFeedbackTitle.trim()) {
            titleError = true;
        }
        if (!feedbackText.trim()) {
            feedbackError = true;
        }

        if (titleError || feedbackError) {
            return;
        }

        saveTextFeedback(feedbackText);
    }

    $effect(() => {
        if (textFeedbackTitle || feedbackText) {
            feedbackSaved = false;

            if (textFeedbackTitle.trim()) {
                titleError = false;
            }
            if (feedbackText.trim()) {
                feedbackError = false;
            }
        }
    });
</script>

<section class="text-recorder " style="border: 0.3rem solid var(--clr-pink);">
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
        <i class="fas fa-save"></i>
        {feedbackSaved ? 'Feedback Saved' : 'Save'}
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


    .error {
        color: red;
        font-size: 0.9rem;
        margin-top: -1rem;
    }

    textarea {
        padding: 1rem;
        min-height: 10vh;
        border-radius: 4px;
        width: 100%;
        height: 15rem;
        background-color: var(--clr-background);
        color: var(--clr-text);
        border: 3px solid var(--clr-text);
    }

    .send-button {
        background-color: var(--clr-background);
        border: 3px solid var(--clr-pink);
        color: var(--clr-text);
        padding: 1rem;
        width: auto;
        max-width: 20rem;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease,
        box-shadow var(--transition-delay) ease;
        font-size: 20px;
    }

    .send-button:hover {
        box-shadow: 0 0 0.3125rem 0.0625rem var(--clr-purple);
    }
</style>