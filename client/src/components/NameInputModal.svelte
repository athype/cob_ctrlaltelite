<script>
    export let closeModal;
    export let handleSaveButtonClick;
    export let name;
    import { fade } from 'svelte/transition';

    let localName = name;

    /**
     * Closes the modal when the overlay is clicked.
     * @param event
     */
    function handleOverlayClick(event) {
        const popup = event.target.closest('.pop-up');
        if (!popup) {
            closeModal();
        }
    }

    /**
     * Closes and saves the name the modal when the close button is clicked.
     */
    function saveAndClose() {
        handleSaveButtonClick(localName);
        closeModal();
    }

    /**
     * Closes the modal when the close button is clicked.
     */
    function closeButtonClick() {
        closeModal();
    }
</script>


<section class="overlay" on:click={handleOverlayClick}>
    <section class="pop-up" transition:fade={{ duration: 500 }}>
        <button class="close-btn" on:click={closeButtonClick}>×</button>
        <div class="name-input-container">
            <input 
                class="name-input" 
                type="text" 
                placeholder="Enter name" 
                bind:value={localName}
            />
            <button class="gradient-border-button" on:click={saveAndClose}>Save</button>
        </div>
    </section>
</section>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
    }

    .pop-up {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30rem;
        height: 11rem;
        background-color: var(--clr-light);
        border: 0.1rem solid #ccc;
        padding: 1.25rem;
        box-shadow: 0 0.25rem 0.5rem var(--clr-dark);
        z-index: 9999;
        display: flex;
        border-radius: 0.5rem;
        justify-content: center;
        align-items: center;
        font-family: Roboto, sans-serif;
        overflow: hidden;
    }

    .pop-up p {
        margin: 0;
        font-size: 2.5rem;
        color: #333;
        line-height: 1.4;
        word-wrap: break-word;
    }

    .close-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #333;
        cursor: pointer;
    }

    .close-btn:hover {
        color: #f00;
    }

    .name-input {
        width: 80%;
        padding: 0.75rem;
        font-size: 1.25rem;
        border-radius: 0.25rem;
        border: 1px solid #ccc;
        margin-bottom: 1rem;
        box-sizing: border-box;
        color: var(--clr-dark);
    }

    .name-input:focus {
        border-color: #007bff;
        outline: none;
    }

    .name-input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>