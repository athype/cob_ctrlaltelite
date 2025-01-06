<script>
    export let label;
    export let onClick;
    export let selected = false;
</script>

<button class="feedback-button" class:selected={selected} on:click={onClick}> {label} </button>

<style>
    button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: 3px solid var(--clr-border);
        cursor: pointer;
        background-color: var(--clr-background);
        color: var(--text-color);
        font-size: 1rem;
        width: 100%;
    }

    button:hover {
        box-shadow: 0 0 5px 1px #9400FF;
        color: var(--background-color);
    }

    button.selected {
        background-color: #7302c4;
        color: var(--background-color);
        border: 3px solid white;
    }
</style>
