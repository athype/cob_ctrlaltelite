<script>
    const {onTextFeedbackSaved, id, audioName} = $props();

    let transcriptionData = $state(null);
    let isLoading = $state(true);
    let error = $state(null);
    let isSaveButtonDisabled = $state(true);
    let saved = $state(false);


    let currentLoadingText = $state('');

    async function fetchTranscription() {
        if (transcriptionData) return;

        const eventSource = new EventSource(`http://localhost:3000/transcription/${id}`);

        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data === null) {
                return;
            }

            if ("transcription" in data) {
                isSaveButtonDisabled = false;
                transcriptionData = data;
                isLoading = false;
                eventSource.close();
                return;
            }

            if ("progress" in data) {
                const {progress} = data;
                switch (progress.status) {
                    case 'initiate':
                        currentLoadingText = `Initiating ${progress.file || 'transcription'}...`;
                        break;
                    case 'download':
                        currentLoadingText = `Downloading ${progress.file || 'files'}...`;
                        break;
                    case 'progress':
                        currentLoadingText = `Loading ${progress.file || 'files'}... ${progress.progress || 0}%`;
                        break;
                    case 'done':
                        currentLoadingText = `Done!`;
                        break;
                    case 'ready':
                        currentLoadingText = `${progress.file || 'Everything'} is ready!`;
                        break;
                    default:
                        currentLoadingText = `Unknown progress status: ${progress.status}`;
                        break;
                }
            }
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
                transcription: newFeedback.feedback_text,
            };


            saved = true;

        } catch (err) {
            console.error('Error saving transcription:', err);
        }
    }


    import {onMount} from 'svelte';

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
        ></textarea>
        {:else}
            <p>No transcription found yet.</p>
        {/if}
    {/if}
    <button
            onclick={saveTranscription}
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