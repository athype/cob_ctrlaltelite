# Functional Design

## 1. Introduction

### 1.1 Problem
Scorion currently lacks an intuitive feedback feature that separates audio feedback from assignment text, 
ensuring that audio data is securely handled while maintaining strict privacy standards. Existing workflows 
for audio feedback are dependent on third-party services, which can introduce privacy risks and are non-compliant with ISO27001.

### 1.2 Problem Analysis
- Current feedback is limited to text or externally recorded audio, which may lack the contextual nuance and convenience of an integrated solution.
- Existing audio recording workflows rely on third-party services that pose significant privacy risks, 
such as unauthorized data storage or access, potentially violating ISO27001 compliance. 
Additionally, these external tools may expose sensitive user data to third-party servers, which could lead to breaches of user confidentiality.
- There is no way to stop or resume recordings, which leads to unnecessary content being captured during interruptions.

### 1.3 Context Research
- Scorion is a digital portfolio platform tailored for students, especially in the medical field, emphasizing gradual feedback instead of end grades.
- The platform provides dashboards for students to review feedback on data points (assignments or supervised tasks).
- An integrated, privacy-compliant audio recording system will enhance the platform’s usability and align with its educational goals.

---

## 2. Solution Overview

### 2.1 Solution Vision
A standalone proof-of-concept feedback feature within Scorion that:
- Enables users to record, store, and play audio feedback securely.
- Provides text-based feedback input and storage.
- Includes optional speech-to-text transcription to convert audio into text in future sprints.
- Supports a user-friendly interface for managing recorded feedback.

### 2.2 Scope
- **In-Scope:**
  - Audio and Video recording, playback, and secure storage of audio files.
  - Text feedback input, storage, and retrieval.
  - Displaying lists of recorded audio, video, and text feedback for easy access.
  - Transcription of audio feedbacks into text, and saving it as s text feedback
  - Standalone proof-of-concept, not integrated into Scorion’s existing platform.

- **Out-of-Scope:**
  - Integration with Scorion's existing system.
  - Audio editing or advanced playback controls.
  - Multi-language support for speech-to-text transcription
  - Video fedback transcription.

### 2.3 Requirements (Non-Functional)
- **Performance:** Low-latency audio and video recording and playback.
- **Scalability:** Efficient storage and retrieval of feedback as the system scales.
- **Security:** Fully local processing for audio recordings and transcription, with no data sent to third parties.
- **Usability:** Intuitive user interface that aligns with Scorion's brand style.

### 2.4 Risks and Assumptions
- **Risks:**
  - Complexity of integrating local speech-to-text libraries (e.g., Whisper, DeepSpeech).
  - Potential UI usability issues during development.
  - Audio and Video file storage could potentially become a bottleneck if not optimized for performance as the number of recordings increases.
- **Assumptions:**
  - SQLite database will be sufficient for storing metadata and audio/video/text feedback securely.
  - The client is primarily focused on core functionality and user experience for the proof-of-concept.

---

## 3. Functional Specs

### 3.1 Business Logic
- **Roles:**
  - Educators: Record and store audio feedback; access and listen to feedback.
  - Students: Record and store audio feedback; access and listen to feedback.
- **Rules:**
  - Audio and video feedback is shown separate from assignment text for greater visibility.
  - Only authorized users can access feedback stored in the system.
- **Data:**
  - Audio files (e.g., `.mp3`, `.wav`).
  - Video files (e.g, `mp4`, `mkv`)
  - Text feedback entries (associated with audio feedback transcription or standalone).

### 3.2 Epics and User Stories
#### Sprint 1: 
- **User Story 1:** As a user, I want to record audio feedback so that I can capture my message more naturally using tone of voice.
  - **Includes the following:**
    - Audio recording
    - Play, pause, and stop buttons for it.
- **User Story 2:** As a user, I want to listen to recorded audio feedback so that I can revisit it later.
  - **Includes the following:**
    - List of recorded audios with a play button.
- **User Story 3:** As a user, I want to type feedback so that I can express my thoughts directly and conveniently.
  - **Includes the following:**
    - Text input field
    - Button for sending (to the list with saved texts)
- **User Story 4:** As a user, I want to view saved text feedback so that I can revisit my previous inputs.
  - **Includes the following:**
    - List with the text field
    - Box for view, where a selected text can be read
#### Sprint 2:
- **User Story 1:** As a user, I want to switch between Light, Dark, and High Contrast modes so that I can use the platform in different environments or based on my visual preferences.
  - **Includes the following:**
    - Integrating Whisper into the backend to process stored audio files.
    - Converting recorded audio files to the required frequency (16,000 Hz).
    - "Transcribe" button to audio feedback previews for initiating transcription.
    - Connecting the transcription feature between the frontend and backend.
- **User Story 2:** As a user, I want to transcribe my audio feedback to text so that I can have flexibility in how I provide feedback.
  - **Includes the following:**
    - A theme switcher to the frontend with options for Light, Dark, and High Contrast modes.
    - Light theme, ensuring consistent styling and smooth transitions.
    - Add High Contrast mode for better accessibility.
#### Sprint 3:
- **User Story 1:** As a user, I want the app to have a convenient and user-friendly interface with specific and relevant guidance so that I can record feedback easily and efficiently
  - **Includes the following:**
    - Feedback lists (audio, text, video) on a separate page.
    - A slider to toggle between different feedback types.
    - Improving the visual design of the interface, including consistent styling and clear labels.
- **User Story 2:** As a user, I want to be able to record video feedback so that I can deliver feedback similar to an in-person experience
  - **Includes the following:**
    - A video recorder component with buttons for record, stop, and playback.
    - Database functionality for video storage and retrieval.
    - A list of recorded videos with options for playback.
- **User Story 3:** As a user, I want real-time feedback during transcription so that I know the progress and status of my request.
  - **Includes the following:**
    - Real-time status updates for the transcription process.
    - Progress stages like uploading, conversion, and transcription on the frontend.

### 3.3 Mockups and wireframes (Low-Fidelity)
#### Mockups
![mockup1.png](..%2Fmd-images%2Fmockup1.png)
![mockup2.png](..%2Fmd-images%2Fmockup2.png)
#### Wireframes
![wireframe.png](..%2Fmd-images%2Fwireframe.png)
---

## 4. System Architecture

### 4.1 Basic Architecture with Logical Components
- **Frontend:**
  - Svelte-based interface for recording, playback, and feedback input.
  - Separate sections for audio feedback, text feedback, and saved lists.
- **Backend:**
  - Express.js backend handling secure audio storage and retrieval.
  - SQLite database for managing metadata and storing text feedback.

### 4.2 Deployment and Component Diagram
- **Deployment Details:**
  - Local SQLite database.
  - Proof-of-concept application, independent of Scorion’s current systems.

---

## 5. Changelog

| Version | Date       | Author | Description                                                                 |
|---------|------------|--------|-----------------------------------------------------------------------------|
| 0.1     | 2023-11-20 | David  | Initial draft based on known context.                                       |
| 0.2     | 2023-12-01 | Din    | Updated based on client meeting, Sprint 1 vision document and user stories. |
| 0.3     | 2023-12-04 | David  | Added low-fidelity mockups, wireframes and updates to introduction          |

