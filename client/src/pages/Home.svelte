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
    let activeIndex = 0;
    let isOpen = false;
    let toggle;
</script>

<Navbar color="dark" theme="dark">
    <NavbarBrand href="/" class="me-auto">Scorion</NavbarBrand>
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
            <div class="text-item">
                <div class="text-item-name">
                    Feedback 23 11-1
                </div>
                <div class="text-item-date" style="font-size: 12px; font-style: italic">
                    29-07-2014
                </div>
            </div>
            <div class="text-item">
                <div class="text-item-name" >
                    Feedback 23 11-1
                </div>
                <div class="text-item-date" style="font-size: 12px; font-style: italic">
                    29-07-2014
                </div>
            </div>
            <div class="text-item">
                <div class="text-item-name">
                    Feedback 23 11-1
                </div>
                <div class="text-item-date" style="font-size: 12px; font-style: italic">
                    29-07-2014
                </div>
            </div>
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

    .recording:hover{
        border-color: blueviolet;
    }

    .text-item:hover{
        border-color: blueviolet;
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
        justify-content: space-between;
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