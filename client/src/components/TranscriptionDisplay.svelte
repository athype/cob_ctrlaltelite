<script lang="ts">
    import { onMount } from 'svelte';

    export let id: number;
    export let audioName: string;
    export let onTextFeedbackSaved: (() => void) | undefined;
    export let language: string = 'en';

    let transcriptionData: { transcription?: string } | null = null;
    let isLoading = true;
    let error: string | null = null;
    let isSaveButtonDisabled = true;
    let saved = false;
    let currentLoadingText = '';

    async function fetchTranscription() {
        const eventSource = new EventSource(`http://localhost:3000/transcription/${id}?language=${language}`);

        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (!data) return;

            // If we have a final transcription:
            if ('transcription' in data) {
                isSaveButtonDisabled = false;
                transcriptionData = data;
                isLoading = false;
                eventSource.close();
                return;
            }

            // If we got partial progress:
            if ('progress' in data) {
                const { status, progress } = data.progress;

                switch (status) {


                    // [ADDED] Immediately after user clicks, server sends 'initializing'
                    case 'initializing':
                        currentLoadingText = 'Initializing transcription...';
                        break;

                    case 'initiate':
                        currentLoadingText = 'Preparing transcription...';
                        break;
                    case 'download':
                        currentLoadingText = 'Fetching required files...';
                        break;
                    case 'progress':
                        if (progress !== undefined) {
                            const percentage = parseFloat(progress).toFixed(1);
                            currentLoadingText = `Processing audio... ${percentage}%`;
                        } else {
                            currentLoadingText = 'Processing audio... 0%';
                        }
                        break;
                    case 'done':
                        currentLoadingText = 'Processing complete!';
                        break;
                    case 'ready':
                        currentLoadingText = 'Loading transcription...';
                        break;
                    default:
                        currentLoadingText = 'Working on it...';
                        break;
                }
            }
        };

        eventSource.onerror = (err) => {
            error = 'Failed to transcribe audio.';
            console.error(err);
            isLoading = false;
            eventSource.close();
        };
    }

    async function saveTranscription() {
        if (!transcriptionData?.transcription) {
            console.error('No transcription to save');
            return;
        }
        const finalTitle = `Transcription - ${audioName || 'Unknown Audio'}`;

        try {
            const response = await fetch('http://localhost:3000/text_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    feedback_text: transcriptionData.transcription,
                    name: finalTitle,
                    id: 1
                })
            });

            if (!response.ok) {
                console.error('Failed to save transcription:', await response.text());
                return;
            }
            onTextFeedbackSaved?.();
            const newFeedback = await response.json();
            console.log('Transcription saved successfully!', newFeedback);

            transcriptionData = {
                ...transcriptionData,
                transcription: newFeedback.feedback_text
            };
            saved = true;
        } catch (err) {
            console.error('Error saving transcription:', err);
        }
    }

    onMount(() => {
        fetchTranscription();
    });
</script>

<div class="transcription-display">
    {#if isLoading}
        <p>{currentLoadingText}</p>
    {:else if error}
        <p>{error}</p>
    {:else}
        {#if transcriptionData?.transcription?.trim()}
            <textarea
                    bind:value={transcriptionData.transcription}
                    rows="5"
                    class="transcription-textarea"
            />
        {:else}
            <p>No transcription found yet.</p>
        {/if}
    {/if}

    <button
            on:click={saveTranscription}
            class="feedback-button"
            disabled={isSaveButtonDisabled}
            class:saved={saved}
    >
        {#if saved}
            Transcription Saved
        {:else}
            <i class="fas fa-save"></i>
            Save Transcription
        {/if}
    </button>
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

    .saved {
        background-color: green !important;
    }

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

    .feedback-button:hover {
        box-shadow: 0 0 5px 1px var(--clr-background);
        color: var(--background-color);
    }

    .feedback-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .transcription-textarea {
        width: 100%;
        padding: 0.5rem;
        border: 2px solid var(--clr-border);
        border-radius: 5px;
        resize: none;
        background-color: var(--clr-background);
        color: var(--clr-text);
        font-size: 1rem;
        font-family: inherit;
        outline: none;
    }

    .transcription-textarea:focus {
        border-color: var(--clr-white);
        box-shadow: 0 0 5px var(--clr-purple);
    }
</style>
