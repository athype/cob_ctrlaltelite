<script>
    export let label = "Feedback"; // The button's label text
    export let onClick; // Event handler for clicks
</script>

<style>
    .feedback-button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: var(--clr-purple);
        color: black;
        font-size: 1rem;
        width: 100%;
        transition: all 0.3s ease;
    }

    .feedback-button:hover {
        box-shadow: 0px 0px 5px 1px #9400FF;
        color: white;
    }
</style>

<button class="feedback-button" on:click={onClick}>
    {label}
</button>