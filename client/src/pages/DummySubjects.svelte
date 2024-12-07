<script>

</script>

<div class="container">
    <div class="items">
        <div class="items-head">
            <p>SUBJECTS</p>
            <hr>
        </div>

        <div class="items-body">
            <div class="items-body-content">
                <a href="/home">
                <span>Neurology</span>
                </a>
            </div>
            <div class="items-body-content">
                <a href="/home">
                    <span>Biology</span>
                </a>
            </div>
            <div class="items-body-content">
                <a href="/home">
                    <span>Surgeology</span>
                </a>
            </div>
            <div class="items-body-content">
                <a href="/home">
                    <span>Practical Knife Skills</span>
                </a>
            </div>
        </div>
    </div>
</div>

<style>

    * {
        font-family: 'Rubik', sans-serif;
    }
    .container {
        border: 1px solid black;
        background-color: #f907fc;
        background-image: linear-gradient(315deg, #f907fc 0%, #05d6d9 74%);
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        margin: auto;
        display: grid;
        place-items: center;
    }

    .items {
        width: 300px;
        background: #fffffe;
        box-shadow: 0 3px 6px #2b63f3, 0 3px 6px gray;
        border-top: 10px solid #2b63f3;
    }

    .items-head p{
        padding: 5px 20px;
        margin: 10px;
        color: black;
        font-weight: bold;
        font-size: 20px;
    }

    .items-head hr {
        width: 20%;
        margin: 0px 30px;
        border: 1px solid #2b63f3;
    }

    .items-body {
        padding: 10px;
        margin: 10px;
        display: grid;
        grid-gap: 10px;
    }

    .items-body-content {
        padding: 10px;
        padding-right: 0px;
        display: grid;
        grid-template-columns: 10fr 1fr;
        font-size: 13px;
        grid-gap: 10px;
        border: 1px solid;
        cursor: pointer;
        border-radius: 15px;
    }

    .items-body-content span {
        color: black;
    }

    .items-body-content:hover {
        border-radius: 15px;
        border: 1px solid #2b63f3;
    }

    @keyframes icon {
        0%,100%{
            transform: translate(0px);
        }
        50% {
            transform: translate(3px);
        }
    }
</style>