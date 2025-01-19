<script>
    // Imports needed for listing feedback items (List.svelte) and displaying transcriptions (TranscriptionDisplay.svelte)
    import List from "./List.svelte";
    import TranscriptionDisplay from "./TranscriptionDisplay.svelte";

    // Props received from the parent: arrays of text, audio, and video feedback, plus a callback after saving text feedback
    let { texts, recordings, videos, onTextFeedbackSaved } = $props();

    // Internal states
    let selectedFeedback = $state(null); // Stores whichever feedback item (text, audio, or video) the user selected
    let showTranscription = $state(false); // Controls visibility of the transcription display
    let activeTab = $state("text");       // Tracks which tab is currently active: "text", "audio", or "video"
    let selectedLanguage = $state('en');  // Toggles between "en" and "nl" for transcription

    /**
     * Switches the language used by the transcription process:
     * 'en' -> 'nl' or 'nl' -> 'en'
     */
    function toggleLanguage() {
        selectedLanguage = (selectedLanguage === 'en') ? 'nl' : 'en';
    }

    /**
     * Changes the active tab (text, audio, or video)
     * and optionally hides the transcription preview.
     */
    function handleTabChange(tab) {
        activeTab = tab;
        showTranscription = false;
    }

    /**
     * When a text feedback is clicked, sets selectedFeedback to that text's details.
     */
    function handleTextFeedbackClick(text) {
        showTranscription = false;
        selectedFeedback = {
            type: "text",
            id: text.id,
            content: text.feedback_text,
            name: text.name,
            created_at: new Date(text.created_at).toISOString().split("T")[0]
        };
    }
    function isTextFeedbackSelected(text) {
        return selectedFeedback?.type === "text" && selectedFeedback?.id === text.id;
    }

    /**
     * When an audio feedback is clicked, sets selectedFeedback to that audio's details.
     */
    function handleAudioFeedbackClick(audio) {
        showTranscription = false;
        selectedFeedback = {
            type: "audio",
            id: audio.id,
            filePath: audio.file_path,
            name: audio.name,
            created_at: new Date(audio.created_at).toISOString().split("T")[0]
        };
    }
    function isAudioFeedbackSelected(audio) {
        return selectedFeedback?.type === "audio" && selectedFeedback?.id === audio.id;
    }

    /**
     * When a video feedback is clicked, sets selectedFeedback to that video's details.
     */
    function handleVideoFeedbackClick(video) {
        showTranscription = false;
        selectedFeedback = {
            type: "video",
            id: video.id,
            filePath: video.file_path,
            name: video.name,
            created_at: new Date(video.created_at).toISOString().split("T")[0]
        };
    }
    function isVideoFeedbackSelected(video) {
        return selectedFeedback?.type === "video" && selectedFeedback?.id === video.id;
    }

    /**
     * Called when user clicks "Transcribe" to reveal the transcription component.
     */
    function handleTranscriptionClick() {
        showTranscription = true;
    }

    /**
     * Returns a stable key for each selectedFeedback so that we force re-mounting
     * and avoid certain 'stuck' states in audio or video playback.
     */
    function getPreviewKey(feedback) {
        if (!feedback) return '';
        return `${feedback.type}-${feedback.id}-${feedback.filePath}`;
    }
</script>

<section class="container">
    <!-- Left side: tabs and feedback lists for text, audio, and video -->
    <section class="left-container">
        <section class="feedback-container">
            <div class="tabs-container">
                <div class="tabs">
                    <button
                            id="text-tab"
                            class:active={activeTab === "text"}
                            class="text-tab"
                            on:click={() => handleTabChange("text")}
                    >
                        <span>Text</span>
                    </button>

                    <button
                            id="audio-tab"
                            class:active={activeTab === "audio"}
                            class="audio-tab"
                            on:click={() => handleTabChange("audio")}
                    >
                        <span>Audio</span>
                    </button>

                    <button
                            id="video-tab"
                            class:active={activeTab === "video"}
                            class="video-tab"
                            on:click={() => handleTabChange("video")}
                    >
                        <span>Video</span>
                    </button>
                </div>

                <div class="content">
                    {#if activeTab === "text"}
                        <section class="tab-content text-tab-content">
                            <List
                                    items={texts}
                                    labelPrefix="Text"
                                    handleClick={handleTextFeedbackClick}
                                    isSelected={isTextFeedbackSelected}
                            />
                        </section>
                    {/if}

                    {#if activeTab === "audio"}
                        <section class="tab-content audio-tab-content">
                            <List
                                    items={recordings}
                                    labelPrefix="Audio"
                                    handleClick={handleAudioFeedbackClick}
                                    isSelected={isAudioFeedbackSelected}
                            />
                        </section>
                    {/if}

                    {#if activeTab === "video"}
                        <section class="tab-content video-tab-content">
                            <List
                                    items={videos}
                                    labelPrefix="Video"
                                    handleClick={handleVideoFeedbackClick}
                                    isSelected={isVideoFeedbackSelected}
                            />
                        </section>
                    {/if}
                </div>
            </div>
        </section>
    </section>

    <!-- Right side: preview of selected item (text/audio/video) and transcription -->
    <section class="right-container">
        <h1 class="title">Preview</h1>
        <div
                class="selected-feedback-display"
                class:selected-audio={selectedFeedback?.type === "audio"}
                class:selected-video={selectedFeedback?.type === "video"}
                class:selected-text={selectedFeedback?.type === "text"}
        >
            {#if selectedFeedback}
                {#key getPreviewKey(selectedFeedback)}
                    <div class="feedback-header">
                        {selectedFeedback.name + " " + selectedFeedback.created_at}
                    </div>

                    {#if selectedFeedback.type === "audio"}
                        <audio controls autoplay>
                            <source
                                    src="http://localhost:3000/{selectedFeedback.filePath}"
                                    type="audio/wav"
                            />
                            Your browser does not support the audio element.
                        </audio>

                        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                            <button
                                    on:click={handleTranscriptionClick}
                                    class="send-button gradient-border"
                            >
                                Transcribe
                            </button>
                            <button
                                    on:click={toggleLanguage}
                                    class="send-button gradient-border"
                            >
                                {selectedLanguage === 'en' ? 'Switch to Dutch' : 'Switch to English'}
                            </button>
                        </div>

                        {#if showTranscription}
                            <TranscriptionDisplay
                                    id={selectedFeedback.id}
                                    audioName={selectedFeedback.name}
                                    language={selectedLanguage}
                                    onTextFeedbackSaved={onTextFeedbackSaved}
                                    type="audio"
                            />
                        {/if}

                    {:else if selectedFeedback.type === "text"}
                        <p style="font-size: 1.5rem; padding: 0.5rem; align-self: center;">
                            {selectedFeedback.content}
                        </p>

                    {:else if selectedFeedback.type === "video"}
                        <video controls autoplay>
                            <source
                                    src="http://localhost:3000/{selectedFeedback.filePath}"
                                    type="video/webm"
                            />
                            Your browser does not support the video element.
                        </video>

                        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                            <button
                                    on:click={handleTranscriptionClick}
                                    class="send-button gradient-border"
                            >
                                Transcribe
                            </button>
                            <button
                                    on:click={toggleLanguage}
                                    class="send-button gradient-border"
                            >
                                {selectedLanguage === 'en' ? 'Switch to Dutch' : 'Switch to English'}
                            </button>
                        </div>

                        {#if showTranscription}
                            <TranscriptionDisplay
                                    id={selectedFeedback.id}
                                    audioName={selectedFeedback.name}
                                    language={selectedLanguage}
                                    onTextFeedbackSaved={onTextFeedbackSaved}
                                    type="video"
                            />
                        {/if}
                    {/if}
                {/key}
            {:else}
                <p style="text-align: center; padding-bottom: 5vh;">
                    Select a feedback to view it here.
                </p>
            {/if}
        </div>
    </section>
</section>

<style>
    .container {
        display: flex;                /* side-by-side layout for left tabs & right preview */
        flex-direction: row;
        flex-wrap: wrap;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        gap: 2.5rem;
    }

    .left-container, .right-container {
        flex: 1;                     /* both sides share available space */
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
        flex: 1;
        width: 100%;
        height: 100%;
    }

    .tabs {
        display: flex;
        justify-content: space-evenly;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .tabs button {
        flex-grow: 1;
        font-weight: 600;
        text-align: center;
        color: var(--clr-text);
        border: dashed;
        border-radius: 0.5rem 0.5rem 0 0;
        cursor: pointer;
        padding: 1rem;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: none;
        transform: translateY(-2px);
        transition: transform 0.3s ease, border-color 0.3s, background-color 0.3s, color 0.3s;
    }

    .tabs button:hover {
        color: var(--clr-highlight);
        border-color: var(--clr-border);
        border: dashed;
        border-bottom: none;
        transform: translateY(-4px);
    }

    .tabs button.active {
        background-color: var(--clr-highlight);
        color: var(--clr-text-active);
        border: 0.225rem solid var(--clr-border);
        transform: translateY(-8px);
        font-size: 17px;
        z-index: 1;
    }

    .tabs .text-tab.active {
        border-color: var(--clr-pink);
    }
    .tabs .audio-tab.active {
        border-color: var(--clr-purple);
    }
    .tabs .video-tab.active {
        border-color: var(--clr-indigo);
    }

    /* Each tab panel has a fixed height to match the preview area */
    .tab-content {
        background-color: var(--clr-background);
        border: 0.3rem solid var(--clr-border);
        border-radius: 0.6rem;
        border-top: 4px solid var(--clr-border);
        box-sizing: border-box;
        height: 28.2rem;
    }

    .text-tab-content {
        border-color: var(--clr-pink);
    }
    .audio-tab-content {
        border-color: var(--clr-purple);
    }
    .video-tab-content {
        border-color: var(--clr-indigo);
    }

    .title {
        font-size: 1.8rem;
        padding: 0.5rem;
        font-weight: 600;
    }

    /* The preview display for selected feedback: single scroll area at 28.2rem height */
    .selected-feedback-display {
        flex: 1;                     /* expands to fill right side */
        display: flex;
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
        padding: 1rem;
        height: 28.2rem;            /* matches the tab content height */
        overflow-y: auto;           /* entire video + transcription in one scroll */
    }

    .selected-feedback-display.selected-audio {
        border-color: var(--clr-purple);
    }
    .selected-feedback-display.selected-video {
        border-color: var(--clr-indigo);
    }
    .selected-feedback-display.selected-text {
        border-color: var(--clr-pink);
    }

    .feedback-header {
        font-size: 1.3rem;
        font-weight: bold;
        padding: 0.7rem;
        border-radius: 0.5rem;
        color: var(--clr-text);
        background-color: var(--clr-inverse);
        text-align: center;
    }


    audio, video {
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

    /* Slim scrollbar for the preview container if content overflows */
    .selected-feedback-display::-webkit-scrollbar,
    textarea::-webkit-scrollbar {
        width: 4px;
    }
    .selected-feedback-display::-webkit-scrollbar-thumb,
    textarea::-webkit-scrollbar-thumb {
        background: var(--clr-text);
        border-radius: 0.25rem;
    }
</style>
