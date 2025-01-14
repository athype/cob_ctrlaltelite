<script>
    export let label;
    export let dateAndTime;
    export let onClick;
    export let selected = false;
</script>

<button class="feedback-button" class:selected={selected} on:click={onClick}>
    <span class="label">{label}</span>
    <span class="date-time">{dateAndTime}</span>
</button>

<style>
    button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2%;
        border-radius: 0.5rem;
        border: 0.2rem solid var(--clr-text);
        cursor: pointer;
        background-color: var(--clr-background);
        color: var(--text-color);
        font-size: 1.3rem;
        width: 100%;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    .label {
        font-size: 1.3rem;
        text-align: center;
        margin-left: 20%;
        flex: 1;
    }

    .date-time {
        font-size: 0.9rem;
        color: var(--text-color);
        margin-left: auto;
        white-space: nowrap;
    }

    button:hover {
        box-shadow: 0 0 0.3rem 0.1rem var(--clr-text);
        color: var(--background-color);
    }

    button.selected {
        background-color: var(--clr-inverse);
        color: var(--background-color);
        border: 0.2rem solid var(--clr-inverse);
        box-shadow: none;
    }

</style>
