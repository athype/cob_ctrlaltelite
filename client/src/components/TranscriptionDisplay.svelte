<script>
    import { fade } from 'svelte/transition';
    export let id;
    export let audioName;
    export let onTranscriptionSaved;

    // 1. Declare variables first
    let transcriptionData = null;
    let isLoading = true;
    let error = null;
    let isSaveButtonDisabled = true;
    let saved = false;

    // If there's no transcription or it's empty, we disable the button.
    $: hasTranscription = !!(transcriptionData?.transcription?.trim());
    // Then we can decide:
    //   - isSaveButtonDisabled = true if hasTranscription is false
    $: isSaveButtonDisabled = !hasTranscription;

    // Loading text cycle
    let loadingIndex = 0;
    let loadingInterval;
    const loadingTexts = [
        'Loading Transcription',
        'Loading Transcription.',
        'Loading Transcription..',
        'Loading Transcription...',
        'Loading Transcription....'
    ];

    // Expose the current loading text based on loadingIndex
    $: currentLoadingText = loadingTexts[loadingIndex];

    /**
     * Fetch the transcription data from the backend.
     * Ideally, the server returns something like:
     * {
     *   transcription: "Transcribed text ...",
     *   audioName: "Some audio title"
     * }
     */
    async function fetchTranscription() {
        try {
            const response = await fetch(`http://localhost:3000/transcription/${id}`);
            if (!response.ok) throw new Error('Failed to fetch transcription');
            transcriptionData = await response.json();

            // If transcription is non-empty, enable the button
            if (transcriptionData.transcription?.trim().length > 0) {
                isSaveButtonDisabled = false;
            }
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    }


    async function saveTranscription() {
        if (!transcriptionData?.transcription) {
            console.error('No transcription to save');
            return;
        }

        // We have the local audioName from Home.svelte
        const finalTitle = `Transcription - ${audioName || 'Unknown Audio'}`;

        try {
            const response = await fetch('http://localhost:3000/text_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    feedback_text: transcriptionData.transcription,
                    name: finalTitle
                })
            });

            if (!response.ok) {
                console.error('Failed to save transcription:', await response.text());
                return;
            }

            // The backend should return the newly created text feedback record
            // For example: { id: 42, feedback_text: "...", name: "Transcription - Some Audio" }
            const newFeedback = await response.json();
            console.log('Transcription saved successfully!', newFeedback);

            // Turn the button green & change text
            saved = true;

            // Notify parent so it can refresh and highlight this new feedback
            onTranscriptionSaved?.(newFeedback);
        } catch (err) {
            console.error('Error saving transcription:', err);
        }
    }

    // fetchTranscription on mount
    import {onDestroy, onMount} from 'svelte';
    onMount(() => {
        fetchTranscription();
        // Start cycling the loading text (only while isLoading is true)
        loadingInterval = setInterval(() => {
            // If we're no longer loading, no need to rotate text
            if (!isLoading) return;

            loadingIndex = (loadingIndex + 1) % loadingTexts.length;
        }, 500);
    });

    onDestroy(() => {
        // Prevent memory leaks
        clearInterval(loadingInterval);
    });

    // We decide if the button should be disabled
    // e.g., if there's no transcription text or we're still loading
    $: isSaveButtonDisabled = isLoading || !transcriptionData?.transcription?.trim() || error;
</script>

<!-- UI -->
<div class="transcription-display">
    <!-- 2) Always show the Save button, but disable if no transcription -->
    <button
            on:click={saveTranscription}
            class="feedback-button"
            disabled={isSaveButtonDisabled}
            class:saved={saved}
    >
        {#if saved}
            Transcription Saved
        {:else}
            Save Transcription
        {/if}
    </button>
    <!-- 1) Show Loading / Error / Transcription Text -->
    {#if isLoading}
        <p>{currentLoadingText}</p>
    {:else if error}
        <p>{error}</p>
    {:else}
        {#if transcriptionData?.transcription?.trim()}
            <p>{transcriptionData.transcription}</p>
        {:else}
            <p>No transcription found yet.</p>
        {/if}
    {/if}
</div>

<style>
    .transcription-display {
        background-color: var(--clr-background);
        padding: 1rem;
        border-radius: 0.5rem;
        color: var(--clr-text);
        font-size: 1rem;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 50vh;
        overflow-y: auto;
        word-wrap: break-word;
        align-items: center;
    }
    button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        background-color: var(--clr-purple);
        color: #fff;
        border: none;
        cursor: pointer;
    }

    /* Turn button green when "saved" is true */
    .saved {
        background-color: green !important;
    }

    /* The feedback-button style, matching list’s item buttons */
    .feedback-button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: 3px solid var(--clr-border);
        cursor: pointer;
        background-color: var(--clr-background);
        color: var(--clr-text);
        font-size: 1rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
    }

    /* Hover effect */
    .feedback-button:hover {
        box-shadow: 0 0 5px 1px var(--clr-background);
        color: var(--background-color);
    }

    .feedback-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

</style>