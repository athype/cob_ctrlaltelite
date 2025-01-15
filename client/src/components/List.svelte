<script>
    import FeedbackButton from "./FeedbackButton.svelte";

    export let items = [];
    export let labelPrefix = '';
    export let dateAndTime;
    export let handleClick;
    export let isSelected = (item) => false;
</script>

<section class="list">
    <header>
    </header>
    {#if items.length > 0}
        {#each items as item}
            <FeedbackButton
                    label={`${item.name}`}
                    dateAndTime={`${item.created_at}`}
                    onClick={() => handleClick(item)}
                    selected={isSelected(item)}
            />
        {/each}
    {:else}
        <p>No {labelPrefix.toLowerCase()} feedback available.</p>
    {/if}
</section>

<style>
    .list {
        flex: 1;
        background-color: var(--clr-background);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-y: auto;
        max-height: 27.75rem;
        min-width: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .list button {
        padding: 0.5rem 1rem;
        border-radius: 0.3125rem;
        border: none;
        cursor: pointer;
        background-color: var(--clr-light);
        color: black;
        font-size: 1rem;
        width: 100%;

    }

    .list button:hover {
        box-shadow: 0 0 0.3125rem 0.0625rem #9400FF;
        color: white;
    }

    .list::-webkit-scrollbar,
    textarea::-webkit-scrollbar {
        width: 4px;
    }
    .list::-webkit-scrollbar-thumb,
    textarea::-webkit-scrollbar-thumb {
        background: var(--clr-text);
        border-radius: 0.25rem;
    }



</style>
