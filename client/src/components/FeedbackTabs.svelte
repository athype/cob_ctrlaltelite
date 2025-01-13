<script>
    import List from "./List.svelte";
    import TranscriptionDisplay from "./TranscriptionDisplay.svelte";
    let recordings = $state([]);
    let texts = $state([]);
    let selectedFeedback = $state(null);
    let showTranscription = $state(false);

    let activeTab = $state([]);


    // Side effect that runs whenever a reactive variable changes, also polling backend for feedback
    $effect(() => {
        fetchFeedback();
    });

    /**
     * Fetches both audio and text feedback from backend api via await.
     */
    async function fetchFeedback() {
        try {
            // Fetch audio feedback
            const recordingsResponse = await fetch('http://localhost:3000/audio-feedback');
            if (recordingsResponse.ok) {
                recordings = await recordingsResponse.json();
            } else if (recordingsResponse.status === 404) {
                console.warn('No audio feedback found.');
                recordings = [];
            } else {
                console.error('Failed to fetch audio feedback:', await recordingsResponse.text());
            }

            // Fetch text feedback
            const textsResponse = await fetch('http://localhost:3000/text-feedback');
            if (textsResponse.ok) {
                texts = await textsResponse.json();
            } else {
                console.error('Failed to fetch text feedback:', await textsResponse.text());
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    }



    /**
     * When tab is pressed we change the content.
     * @param text
     */
    function handleTabChange(tab) {
        activeTab = tab;
    }

    /**
     * When text feedback is clicked, selected feedback is updated with its data.
     * @param text
     */

    function handleTextFeedbackClick(text) {
        selectedFeedback = {
            type: 'text',
            id: text.id,
            content: text.feedback_text,
            name: `Text Feedback: ${text.name}`
        };
    }

    /**
     * Helper function for determining if a text is selected.
     * @param text
     */

    function isTextFeedbackSelected(text) {
        return selectedFeedback?.type === 'text' && selectedFeedback?.id === text.id;
    }

    /**
     * When an audio feedback is clicked, selected feedback is updated with its data.
     * @param recording
     */

    function handleAudioFeedbackClick(recording) {
        showTranscription = false;
        selectedFeedback = {
            id: recording.id,
            type: 'audio',
            filePath: recording.file_path,
            name: `Audio Feedback: ${recording.name}`
        };
    }

    /**
     * Helper function for determining if an audio is selected.
     * @param recording
     */

    function isAudioFeedbackSelected(recording) {
        return selectedFeedback?.type === 'audio' && selectedFeedback?.id === recording.id;
    }


    async function handleTranscriptionClick() {
        showTranscription = true;
    }





    /**
     * When an video feedback is clicked, selected feedback is updated with its data.
     * @param video
     */

    function handleVideoFeedbackClick(video) {
        showTranscription = false;
        selectedFeedback = {
            id: video.id,
            type: 'video',
            filePath: video.file_path,
            name: `Video Feedback: ${video.name}`
        };
    }

    /**
     * Helper function for determining if an video is selected.
     * @param video
     */

    function isVideoFeedbackSelected(video) {
        return selectedFeedback?.type === 'video' && selectedFeedback?.id === video.id;
    }



</script>
<section class="container">
    <section class="left-container">
        <section class="feedback-container">
            <div class="tabs-container">
                <div class="tabs">
                    {#each ["text", "audio", "video"] as tab}
                        <button
                                key={tab}
                                on:click={() => handleTabChange(tab)}
                                class:active={activeTab === tab} >
                            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                        </button>
                    {/each}
                </div>

                <div class="content">
                    {#if activeTab === "text"}
                        <section id="content-text" class="tab-content">
                            <List
                                    items={texts}
                                    labelPrefix="Text"
                                    handleClick={handleTextFeedbackClick}
                                    isSelected={isTextFeedbackSelected} />
                        </section>
                    {/if}

                    {#if activeTab === "audio"}
                        <section id="content-audio" class="tab-content">
                            <List
                                    items={recordings}
                                    labelPrefix="Audio"
                                    handleClick={handleAudioFeedbackClick}
                                    isSelected={isAudioFeedbackSelected} />
                        </section>
                    {/if}

                    {#if activeTab === "video"}
                        <section id="content-video" class="tab-content">
                            <List
                                    items={videos}
                                    labelPrefix="Video"
                                    handleClick={handleVideoFeedbackClick}
                                    isSelected={isVideoFeedbackSelected} />
                        </section>
                    {/if}
                </div>
            </div>
        </section>
    </section>
    <!--    This is the container on the right which contains the feedback previews-->
    <section class="right-container">
        <h1 class="title">Preview</h1>
        <div class="selected-feedback-display">
            {#if selectedFeedback}
                <div class="feedback-header">{selectedFeedback.name}</div>
                {#if selectedFeedback.type === 'audio'}
                    {#key selectedFeedback.id}
                        <audio controls autoplay>
                            <source src="http://localhost:3000/{selectedFeedback.filePath}" type="audio/wav"/>
                            Your browser does not support the audio element.
                        </audio>
                        <button on:click={handleTranscriptionClick} class="send-button gradient-border">Transcribe</button>
                        {#if showTranscription}
                            <TranscriptionDisplay id={selectedFeedback.id}/>
                        {/if}
                    {/key}
                {:else if selectedFeedback.type === 'text'}
                    <!-- Directly display the content (no typewriter effect) -->
                    <p style="font-size: 1.3rem; padding: 0.5rem;">{selectedFeedback.content}</p>
                {/if}
            {:else}
                <p style="text-align: center; padding-bottom: 5vh">
                    Select a feedback to view it here.
                </p>
            {/if}
        </div>
    </section>

</section>

<style>
    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        gap: 2.5rem;
    }

    .left-container, .right-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .feedback-container {
        background-color: var(--clr-background);
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        box-sizing: border-box;
        flex: 1;
        max-width: 100%;
    }





    .tabs-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .tabs {
        display: flex;
        justify-content: space-evenly;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .tabs button  {
        flex-grow: 1;
        font-weight: 600;
        text-align: center;
        color: var(--clr-text);
        border: dashed;
        border-radius: 0.5rem 0.5rem 0 0;
        cursor: pointer;
        transition: transform 0.3s ease, border-color 0.3s, background-color 0.3s, color 0.3s;
        padding: 1rem;
        height: 3rem;
        display: flex; /* Ensure flexbox is used for vertical alignment */
        justify-content: center;
        align-items: center;
        border-bottom: none;
        transform: translateY(-2px);
    }

    .tabs button div {
        display: inline-block; /* Prevent text from being affected by transform */
    }

    /* Hover effect */
    .tabs button:hover {
        color: var(--clr-highlight);
        border-color: var(--clr-border);
        border: dashed;
        border-bottom: none;
        transform: translateY(-4px); /* Move the button up slightly when hovered */
    }

    /* Active state */
    .tabs button.active {
        background-color: var(--clr-highlight);
        color: var(--clr-text-active);
        border-color: var(--clr-border);
        border: 0.225rem solid var(--clr-border);
        transform: translateY(-8px); /* Move the button up more when active */
        font-size: 17px;
        z-index: 1;
    }



    .content {
        width: 100%;
    }

    .tab-content {
        display: block;
        border: 0.3rem solid var(--clr-border);
        border-radius: 0.6rem;
        border-top: 3px solid var(--clr-border);
        background-color: var(--clr-background);
    }






    input {
        display: none;
    }



    label {
        display: block;
        padding: 1rem 4vw;
        font-weight: 600;
        text-align: center;
        color: var(--clr-text);
        border: 0.225rem solid transparent;
        border-radius: 0.5rem 0.5rem 0 0;
        box-sizing: border-box;
        cursor: pointer;
    }

    label:hover {
        color: var(--clr-text);
        border-color: var(--clr-pink);
        border-bottom: none;
    }



    .selected-feedback-display {
        flex: 1;
        display: flex;
        padding: 1rem;
        flex-direction: column;
        background-color: var(--clr-background);
        border-radius: 0.5rem;
        border: 0.3rem solid var(--clr-border);
        color: var(--clr-text);
        font-size: 1rem;
        text-align: left;
        gap: 1rem;
        word-wrap: break-word;
        width: 100%;
        box-sizing: border-box;
    }

    .feedback-header {
        font-size: 1.3rem;
        font-weight: bold;
        padding-top: 0.5rem;
        padding-left: 0.5rem;
        border-radius: 0.25rem;
        color: var(--clr-text);
    }

    audio {
        width: 70%;
        margin-left: auto;
        margin-right: auto;
        color-scheme: dark;
    }

    .send-button {
        position: relative;
        border: 0.225rem;
        color: var(--clr-text);
        padding: 0.5rem;
        align-self: center;
        border-radius: 0.625rem;
        transition: background-color var(--transition-delay) ease,
        color var(--transition-delay) ease;
    }

    .title {
        font-size: 2rem;
        padding: 0.5rem;
        font-weight: 600;
    }


</style>
