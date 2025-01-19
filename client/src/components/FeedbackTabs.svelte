<script>
    import List from "./List.svelte";
    import TranscriptionDisplay from "./TranscriptionDisplay.svelte";

    let { texts, recordings, videos, onTextFeedbackSaved } = $props();

    let selectedFeedback = $state(null);
    let showTranscription = $state(false);
    let activeTab = $state("text");
    let selectedLanguage = $state('en');

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
     * When text feedback is clicked, selected feedback is updated with its data.
     * @param text
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

    /**
     * Helper function for determining if a text is selected.
     * @param text
     */
    function isTextFeedbackSelected(text) {
        return selectedFeedback?.type === "text" && selectedFeedback?.id === text.id;
    }

    /**
     * When an audio feedback is clicked, selected feedback is updated with its data.
     * @param audio
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
     * When an video feedback is clicked, selected feedback is updated with its data.
     * @param video
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

    /**
     * Helper function for determining if an video is selected.
     * @param video
     */
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
    <section class="left-container">
        <section class="feedback-container">
            <div class="tabs-container">
                <div class="tabs">
                    <button
                            id="text-tab"
                            class:active={activeTab === "text"}
                            class="text-tab"
                            onclick={() => handleTabChange("text")}
                    >
                        <span>Text</span>
                    </button>

                    <button
                            id="audio-tab"
                            class:active={activeTab === "audio"}
                            class="audio-tab"
                            onclick={() => handleTabChange("audio")}
                    >
                        <span>Audio</span>
                    </button>

                    <button
                            id="video-tab"
                            class:active={activeTab === "video"}
                            class="video-tab"
                            onclick={() => handleTabChange("video")}
                    >
                        <span>Video</span>
                    </button>
                </div>

                <div class="content">
                    {#if activeTab === "text"}
                        <section id="content-text" class="tab-content text-tab-content">
                            <List
                                    items={texts}
                                    labelPrefix="Text"
                                    handleClick={handleTextFeedbackClick}
                                    isSelected={isTextFeedbackSelected}
                            />
                        </section>
                    {/if}

                    {#if activeTab === "audio"}
                        <section id="content-audio" class="tab-content audio-tab-content">
                            <List
                                    items={recordings}
                                    labelPrefix="Audio"
                                    handleClick={handleAudioFeedbackClick}
                                    isSelected={isAudioFeedbackSelected}
                            />
                        </section>
                    {/if}

                    {#if activeTab === "video"}
                        <section id="content-video" class="tab-content video-tab-content">
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
                                    onclick={handleTranscriptionClick}
                                    class="send-button gradient-border"
                            >
                                Transcribe
                            </button>
                            <button
                                    onclick={toggleLanguage}
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
                                    onclick={handleTranscriptionClick}
                                    class="send-button gradient-border"
                            >
                                Transcribe
                            </button>
                            <button
                                    onclick={toggleLanguage}
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
        transition: transform 0.3s ease, border-color 0.3s, background-color 0.3s, color 0.3s;
        transform: translateY(-0.125rem);
    }

    .tabs button div {
        display: inline-block;
    }

    .tabs button:hover {
        color: var(--clr-highlight);
        border-color: var(--clr-border);
        border: dashed;
        border-bottom: none;
        transform: translateY(-0.25rem);
    }

    .tabs button.active {
        background-color: var(--clr-highlight);
        color: var(--clr-text-active);
        border: 0.225rem solid var(--clr-border);
        transform: translateY(-0.5rem);
        font-size: 1rem;
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

    .tab-content {
        background-color: var(--clr-background);
        border: 0.3rem solid var(--clr-border);
        border-radius: 0.6rem;
        border-top: 0.25rem solid var(--clr-border);
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
        height: 28.2rem;
        overflow-y: auto;
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

    .title {
        font-size: 1.8rem;
        padding: 0.5rem;
        font-weight: 600;
    }

    .selected-feedback-display::-webkit-scrollbar,
    textarea::-webkit-scrollbar {
        width: 0.25rem;
    }
    .selected-feedback-display::-webkit-scrollbar-thumb,
    textarea::-webkit-scrollbar-thumb {
        background: var(--clr-text);
        border-radius: 0.25rem;
    }

    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        gap: 2.5rem;
    }

</style>
