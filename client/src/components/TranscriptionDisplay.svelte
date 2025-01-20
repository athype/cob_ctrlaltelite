<script lang="ts">
    import { onMount } from 'svelte';

    /**
     * Props from the parent:
     *  - id: numeric ID of the feedback item (audio or video)
     *  - audioName: display name of the file for the final saved transcription
     *  - onTextFeedbackSaved: callback after transcription is saved
     *  - language: 'en' or 'nl' (for transcription)
     *  - type: 'audio' or 'video' (which SSE endpoint to call)
     */
    export let id: number;
    export let audioName: string;
    export let onTextFeedbackSaved: (() => void) | undefined;
    export let language: string = 'en';
    export let type: 'audio' | 'video' = 'audio';

    let transcriptionData: { transcription?: string } | null = null;
    let isLoading = true;
    let error: string | null = null;
    let isSaveButtonDisabled = true;
    let saved = false;
    let currentLoadingText = '';

    /**
     * Sets up an SSE connection to /transcription/:id,
     * sending ?language and ?type. Updates progress as it arrives.
     */
    async function fetchTranscription() {
        const url = `http://localhost:3000/transcription/${id}?language=${language}&type=${type}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (!data) return;

            if ('transcription' in data) {
                isSaveButtonDisabled = false;
                transcriptionData = data;
                isLoading = false;
                eventSource.close();
                return;
            }

            if ('progress' in data) {
                const { status, progress } = data.progress;

                switch (status) {
                    case 'initializing':
                        currentLoadingText = 'Initializing transcription...';
                        break;
                    case 'initiate':
                        currentLoadingText = 'Preparing transcription...';
                        break;
                    case 'download':
                        currentLoadingText = 'Fetching required files...';
                        break;
                    case 'reading_audio':
                        currentLoadingText = 'Reading audio file...';
                        break;
                    case 'extracting':
                        currentLoadingText = 'Extracting audio track...';
                        break;
                    case 'loading_whisper':
                        currentLoadingText = 'Loading Whisper model...';
                        break;
                    case 'progress':
                        if (progress !== undefined) {
                            const pct = parseFloat(progress).toFixed(1);
                            currentLoadingText = `Processing audio... ${pct}%`;
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
            error = 'Failed to transcribe.';
            console.error('Transcription SSE error:', err);
            isLoading = false;
            eventSource.close();
        };
    }

    /**
     * Saves the transcription text to the server, then calls onTextFeedbackSaved.
     */
    async function saveTranscription() {
        if (!transcriptionData?.transcription) {
            console.error('No transcription to save');
            return;
        }

        const finalTitle = `Transcription - ${audioName || 'Unknown File'}`;

        try {
            const response = await fetch('http://localhost:3000/text-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            <i class="fas fa-save"></i> Save Transcription
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

    .feedback-button {
        border: 3px solid var(--clr-border);
        background-color: var(--clr-background);
        color: var(--clr-text);
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
    }

    .feedback-button:hover {
        box-shadow: 0 0 5px 1px var(--clr-background);
    }

    .feedback-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .saved {
        background-color: green !important;
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
