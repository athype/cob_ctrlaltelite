<script>
    let message = "Default message";
</script>

<main class="modal">
    <section class="pop-up">
        <p>{message}</p>
    </section>
</main>


<style>
    .modal {

    }
    .pop-up {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50rem;
        background-color: rgba(255, 255, 255);
        border: 0.1rem solid #ccc;
        padding: 1.25rem;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
        z-index: 9999;
        border-radius: 0.5rem;
        font-family: Arial, sans-serif;
    }

    .pop-up p {
        margin: 0;
        font-size: 1rem;
        color: #333;
    }
</style>