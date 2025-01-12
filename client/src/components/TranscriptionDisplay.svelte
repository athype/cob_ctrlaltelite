<script>
    export let id;
    let transcription = fetchTranscription(id);

    export async function fetchTranscription(id) {
            const response = await fetch(`http://localhost:3000/transcription/${id}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to fetch transcription.');
            }
    }

</script>

<div class="transcription-display">
    {#await transcription}
        <p>Loading...</p>
    {:then transcription}
        {#if transcription.transcription === ''}
            <p>No transcription found.</p>
        {:else}
            <p>{transcription.transcription}</p>
        {/if}
    {:catch error}
        <p>{error.message}</p>
    {/await}
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
</style>