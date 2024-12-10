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
        border: none;
        cursor: pointer;
        background-color: var(--clr-purple);
        color: black;
        font-size: 1rem;
        width: 100%;
        transition: background-color 0.3s, color 0.3s;
    }

    button:hover {
        box-shadow: 0 0 5px 1px #9400FF;
        color: white;
    }

    button.selected {
        background-color: #7302c4;
        color: white;
        border: 3px solid white;
    }
</style>
