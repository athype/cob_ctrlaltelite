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
        justify-content: center;
        align-items: center;
        padding: 0.5rem 2%;
        border-radius: 0.5rem;
        border: 0.2rem solid var(--clr-text);
        cursor: pointer;
        background-color: var(--clr-background);
        color: var(--text-color);
        width: 100%;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
    }

    .label {
        font-size: 1.3rem;
        text-align: center;
        margin-left: 20%;
        flex: 2;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .date-time {
        font-size: 0.7rem;
        color: var(--clr-dimmed);
        text-align: right;
        white-space: nowrap;
        flex: 1;
    }

    button:hover {
        box-shadow: 0 0 5px 1px var(--clr-text);
        color: var(--background-color);
    }

    button.selected {
        background-color: var(--clr-inverse);
        color: var(--background-color);
        border: 3px solid var(--clr-inverse);
        box-shadow: none;
    }
    
    @media screen and (max-width: 1024px) {
        button{
            justify-content: right;

        }
        .date-time{
            font-size: 0.6rem;
            margin-bottom: 0;
        }
        .label{
            font-size: 1rem;
            text-align: left;
        }
    }

</style>
