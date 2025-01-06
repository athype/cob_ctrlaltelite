<script>
    export let title = '';
</script>

<main>
    <input type="text" bind:value={title} placeholder="Feedback title" />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    input {
        padding: 1rem;
        min-height: 5vh;
        border-radius: 4px;
        background-color: var(--clr-background);
        color: var(--clr-text);
        border: 0 solid var(--clr-border);
        border-top-width: 1px;
        width: 100%;
    }
</style>