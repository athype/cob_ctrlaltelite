<script>
    import {
        Button,
        Card,
        CardHeader,
        CardTitle,
        CarouselIndicators, Collapse, Nav,
        Navbar,
        NavbarBrand, NavbarToggler, NavItem, NavLink
    } from '@sveltestrap/sveltestrap';
    import { Icon } from '@sveltestrap/sveltestrap';
    import { Carousel, CarouselControl, CarouselItem } from '@sveltestrap/sveltestrap';
    const items = [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
    ];
    let activeIndex = 0;
    let isOpen = false;

    let toggle;
</script>

<Navbar color="dark" theme="dark">
    <NavbarBrand href="/" class="me-auto">sveltestrap</NavbarBrand>
    <NavbarToggler on:click={toggle} class="me-2" />
    <Collapse {isOpen} navbar>
        <Nav navbar>
            <NavItem>
                <NavLink href="#components/">Components</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="https://github.com/sveltestrap/sveltestrap">GitHub</NavLink>
            </NavItem>
        </Nav>
    </Collapse>
</Navbar>

<main class="container">
    <div class="flex">


        <div class="section recordings">
            <h2 style="font-size: 22px">Recordings</h2>
            <div class="recording">
                <Button outline color="primary" class="play-button">
                    <Icon name="play" />
                </Button>
                <div class="waveform">|-╹-〢-〡-╷-----------------〣-╻-╹-╿-╽-〢-〡-╷-〣-╻-╹-╿-╽-┃-│</div>
            </div>
            <div class="recording">
                <Button outline color="primary" class="play-button">
                    <Icon name="play" />
                </Button>
                <div class="waveform">|-╹-〢-〡-╷-〣-╻-╹-╿-╽-┃-│|-╹-〢-〡-╷-〣-╻-╹-╿-╽-┃---------╻-╹-╿-╽-┃-│</div>
            </div>
            <div class="recording">
                <Button outline color="primary" class="play-button">
                    <Icon name="play" />
                </Button>
                <div class="waveform">|-╹-〢--╿-╽-┃-│|------------〣-╻-╹-╿-╽-┃-│|-╹-〢-〡-╷-〣-╻-╹-╿-╽-┃-│</div>
            </div>
        </div>


        <div class="section texts">
            <h2 style="font-size: 22px">Texts</h2>
            <div class="text-item">Feedback 23 11-1</div>
            <div class="text-item">Feedback 23 11-2</div>
            <div class="text-item">Feedback 24 11-1</div>
        </div>
    </div>


    <Card class="selected-text-display">
        <CardHeader>
            <CardTitle style="color: blueviolet">Feedback 23 11-1</CardTitle>
        </CardHeader>
        <p>Excellent job, but blablabla</p>
    </Card>




    <div class="record-send">
        <section class="record-container">
            <button class="record-btn">🔴</button>
            <div class="waveform">|-╹-〢--╿-╽--------〢-〡-╷-〣-╻-╹-╿--------------------╹-〢-〡-╷-〣-╻-╹-╿-╽-┃-│</div>
        </section>
        <button class="send-btn">Send</button>
    </div>



    <div class="input-section">
        <input type="text" placeholder="Type feedback here..." />
        <button class="send-btn">Send</button>
    </div>

    <Carousel {items} bind:activeIndex>
        <div class="carousel-inner">
            {#each items as item, index}
                <CarouselItem bind:activeIndex itemIndex={index}>
                    <img src={item} class="d-block w-100" alt="{item} {index + 1}" />
                </CarouselItem>
            {/each}
        </div>

        <CarouselControl direction="prev" bind:activeIndex {items} />
        <CarouselControl direction="next" bind:activeIndex {items} />
    </Carousel>

</main>




<style>

    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .flex {
        display: flex;
        justify-content: space-between;
    }

    .section {
        flex: 1;
        padding: 1rem;
        border: 1px solid var(--clr-light);
    }





    .recordings, .texts {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .recording {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 0.5rem;
        border: 1px solid var(--clr-light);
    }

    .waveform{
        color: var(--clr-purple);
    }

    .play-button{
        padding: 0.5rem;
        background-color: var(--clr-purple);
        cursor: pointer;
        border-radius: var(--radius);
        box-shadow: 0 0 5px 2px var(--clr-purple);
        transition: all 0.3s ease;
    }

    .play-button:hover {
        background-color: var(--clr-light);
        color: var(--clr-dark);
        transform: scale(1.1);
    }




    .text-item {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border: 1px solid var(--clr-light);
        cursor: pointer;
    }

    .text-item.selected {
        border: 1px solid var(--clr-purple);
    }

    .selected-text-display {
        border: 1px solid var(--clr-light);
        padding: 1rem;
        padding-bottom: 150px;
    }

    .feedback-title {
        color: var(--clr-purple);
        font-size: 20px;
        font-style: oblique;
    }






    .record-send {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 150px;

    }

    .record-container{
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        padding: 1rem;
        border: 1px solid var(--clr-light);
        background-color: var(--clr-dark);
        color: var(--clr-light);
    }

    .record-btn{
        transition: all 0.3s ease;
    }

    .record-btn:hover {
        transform: scale(1.3);
    }





    .send-btn {
        padding: 1.5rem;
        background-color: var(--clr-purple);
        color: var(--clr-light);
        cursor: pointer;
        border-radius: var(--radius);
        transition: all 0.3s ease;
    }



    .send-btn:hover{
        transform: scale(1.1);
    }

    .input-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    input[type="text"] {
        flex: 1;
        padding: 1.5rem;
        border: 1px solid var(--clr-light);
        background-color: var(--clr-dark);
        color: var(--clr-light);
    }
</style>