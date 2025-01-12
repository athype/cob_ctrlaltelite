<script>
    import FeedbackButton from "./FeedbackButton.svelte";

    export let items = [];
    export let labelPrefix = '';
    export let handleClick;
    export let isSelected = (item) => false;
</script>

<section class="list">
    <header>
        <h2>{labelPrefix} Feedback</h2>
    </header>
    {#if items.length > 0}
        {#each items as item}
            <FeedbackButton
                    label={`${labelPrefix} Feedback ${item.name}`}
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
        border: 0.225rem solid var(--clr-border);
        /*border-left: 0;*/
        /*border-right: 0;*/
        /*border-bottom: 0;*/
        overflow-y: auto;
        max-height: 18.75rem;
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
        background-color: var(--clr-purple);
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
        background: white;
        border-radius: 0.25rem;
    }



</style>
