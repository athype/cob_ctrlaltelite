# Technical Design Final Version (v3.0)

## 1. Introduction

### Project Description
The project is focused on developing text and voice feedback features with optional voice recognition for the company Scorion.
Scorion develops a student portfolio system that aims to provide feedback not only for the final grading, but for smaller parts of each task called data points.
The data point approach allows students to get a fuller picture of their progress. For this reason, feedback is a primary focus.

### Objectives
To send feedback, Scorion currently relies on external systems, such as sending forms or using a mobile device's speech recognition tool.
For this project, Scorion wants to detach from the use of third-party servers and build their own set of feedback features.
The project is a proof of concept, so the development of the specified features is to be done separately from the existing software.

The objectives can be defined as follows:
- Provide a voice feedback feature that allows recordings to be stored.
- Provide a text input feature that allows users to type and store feedback.
- Include a voice-to-text conversion for audio feedback using Whisper from HuggingFace.
- Preserve confidentiality of users by avoiding the use of third-party services.
- Optionally explore a video feedback feature for future enhancement.

### Scope

This document describes the technical design part of the project. It explains the choice of frameworks and components, architectural decisions, and their correspondence with requirements.

### Stakeholders
- **Client**: Scorion, which formulates the requirements for the project.
- **Lecturer**: Eelco Jannink, who defines the primary frameworks to be used and serves as an intermediary in communication with the client.

---

## 2. General Overview and Approach

The general approach when making technical decisions is to base them on the client's requirements.
The choice of frameworks is a critical part of the project's architecture as it determines how well features can be realized and how easily they can be maintained.

Key considerations include:
- Ensuring modularity and reusability of components.
- Keeping the frontend and backend independent.
- Ensuring the system is extendable and maintainable.

---

## 3. Design Considerations

### Frontend
- **Framework**: Svelte is used for its simplicity and performance.
- **Component Design**:
    - Components must be modular, reusable, and well-contextualized.
    - Styling is tied to components or applied across the entire project when appropriate.
- **User Experience**:
    - Prioritized over technical complexity.
    - The interface must be intuitive, accessible, and easy to use.

### Backend
- **Framework**: Node.js with Express.js for routing and API management.
- **Design**:
    - Modular codebase for easy extension and maintenance.
    - Integration of the MediaStream API for audio recording and playback.
    - Whisper (from HuggingFace) for speech-to-text processing.
- **Performance**:
    - Focus on responsiveness and optimized algorithms.

---

## 4. System Architecture

### Logical View (Functional Components)

![conceptual_diagram.png](..%2Fmd-images%2Fconceptual_diagram.png)

1. Frontend Components:
- Feedback Form: Acts as the main interface where users record audio, preview feedback, and submit the form.
- Audio Recorder: Captures audio and sends it to the backend for processing.
- Preview Component: Allows users to review the recorded audio and transcribed text.
2. Backend Components:
- API Gateway: Manages all interactions between the frontend and backend modules.
- Audio Processing Module: Handles audio file compression, encryption, and storage preparation.
- Speech-to-Text Integration: Interfaces with the external API for transcription.
- Speech-to-Text API: Processes audio and returns transcription data.
3. Database:
- Feedback Data: Stores user feedback, including audio files and text, securely.

### Hardware Architecture (Deploy)

![hardware_architecture.png](..%2Fmd-images%2Fhardware_architecture.png)

1. User Device:
- Represents the client device accessing the application via a web browser.
- Includes a microphone for audio recording. Includes a camera/webcam for video recording.
2. Application Server:
- Frontend Server: Hosts and serves the Svelte UI components to the browser.
- Backend Server: Processes user requests, handles audio and video files, interacts with the database, and integrates with the speech-to-text and media recording APIs.
- Speech-to-Text API: Converts audio feedback into text.
- Video Processing API: Processes uploaded video feedback.
3. Database Server:
- SQLite: Securely stores user feedbacks, including audio and video files with transcriptions.

### Software Architecture

#### Overview
- Svelte for the frontend interface.
- Node.js and Express.js for the backend.
- SQLite for database storage.

#### Libraries
- MediaStream API for audio recording and playback.
- Whisper library (HuggingFace) for speech-to-text functionality.
- Svelte-simple-modal for the pop-up screen.
- Font awesome for icons.

#### Frameworks
- **Frontend**: Svelte components.
- **Backend**: Node.js and Express.js.

#### Components

1. **FeedbackButton**:
- Supports icons, labels, and actions on press.
- Customizable colors for different contexts (e.g., Record, Stop, Play, Send).

2. **List**:
- Displays a list of items (e.g., feedback list).

3. **TitleInputField**:
- Allow user to edit or fill in texts.

4. **AlertModal**
- Shows confirmation or errors.

5. **AudioRecorder**
- Handles audio recording and accessibility to microphone.

6. **FeedbackModal**
- Displays a pop-up when click on Add a new feedback.
- Show tabs that provide option for user to choose which type of feedback to add.

7. **FeedbackModalContent**
- Basically the design for the Add new feedback button.

8. **FeedbackTabs**
- Shows tabs of feedback type being listed.
- Allow users to preview any feedbacks in the database.
- Handle real-time transcription.

9. **NameInputModal**
- A pop-up that appears when user save a new feedback that allows them to name the feedback they just added.

10. **TextRecorder**
- Handles text feedback.
- Allows user to type in text feedbacks.

11. **ThemeSwitch**
- Allows user to switch between dark, light and high contrast theme.

12. **TranscriptionDisplay**
- Display real-time transcriptions from audio or video feedbacks.

13. **VideoRecorder**
- Handles video recording and accessibility to camera/webcam.

### APIs

- **MediaStream API**: Handles audio recording and playback.
- **Whisper API** (HuggingFace): Provides local speech-to-text functionality.
- **MediaRecorder API**: Provides camera recorder and enables the recording of media stream.

### Information Architecture

![info_architecture.png](..%2Fmd-images%2Finfo_architecture.png)

1. Entities:
- TextFeedback: Represents text-based feedback submitted by users, with attributes for content, timestamp, and user association.
- VideoFeedback: Represents video feedback with attributes for file path, timestamp, and duration.
- AudioFeedback: Represents audio feedback with attributes for file path, timestamp, and duration.
- User: Represents users who submit feedback.

2. Relationship:
- A User can create multiple feedback entries for each feedback type (TextFeedback, VideoFeedback, and AudioFeedback).

3. Data Types:
- Audio files (e.g., `.wav`).
- Text feedback entries.

4. Data Navigation:
- Accessible via intuitive UI lists for saved audio and text feedback.

### Security Architecture
- Whisper is secure due to its ability to process data locally, ensuring privacy, reducing reliance on third-party services, supporting encryption, and providing transparency through its open-source nature.
- All data is processed and stored locally to ensure confidentiality. No third-party servers are used for sensitive data which fulfilled client's needs for security.
- No third-party servers are used for sensitive data.

### Performance

- The performance of the Whisper model depends on the variant (Tiny, Base, Small, Medium, Large). Smaller models (Tiny/Base) are faster and lightweight, suitable for near real-time transcription with moderate accuracy, using 1–2GB VRAM. Larger models (Medium/Large) are slower but highly accurate, requiring 10+GB VRAM and performing best for offline or high-quality transcription tasks. GPU acceleration significantly enhances speed, while CPU usage is feasible but slower.
- Audio recording and playback must be low-latency.
- Whisper integration should handle transcription efficiently, even with larger audio files.

---

## 5. System Design

![class_diagram.png](..%2Fmd-images%2Fclass_diagram.png)

### Database Design

- **Database**: SQLite is used to store recordings and textual feedback.
- **Reasoning**:
    - Ease of integration and maintenance.
    - File-based storage for enhanced security.

### User Interface Design

#### First sketches of the wireframes 

![wireframe1.png](..%2Fmd-images%2Fwireframe1.png)
![wireframe2.png](..%2Fmd-images%2Fwireframe2.png)

From technical perspective, not user perspective. 
- **Principles**:
    - Focus on simplicity and intuitiveness.
    - Clear labeling and purposeful placement of buttons.
- **UI Elements**:
    - Lists for displaying saved feedback.
    - Buttons for audio actions (Record, Play, Pause, Stop).


### Software Design

- Modular and extendable backend structure.
- Reusable Svelte components for the frontend.
- Frameworks and libraries.
- Mobile responsiveness.

### Security Design

- Local data processing and storage to align with privacy requirements.
- ISO27001 compliance for system security.

---

## 6. Data Flow

![sequence_diagram.png](..%2Fmd-images%2Fsequence_diagram.png)

### Audio/Video Recording and Transcription
1. Users clicks on the record button to start audio or camera capture.
2. Audio or video is recorded and temporarily stored in the browser.
3. On saving, audio or video file will be sent to backend for storage and real-time transcription via Whisper API.
4. Transcripted text is returned to the frontend for users to edit and submit

### Feedback Submission
1. Users can preview and edit text/audio/video with transcriptions.
2. On submitting, the files will be sent to backend for validation and storage in the database.

---

## 7. Data Model

### Feedback Models

```
text_feedback
{
 "id": "id", 
 "feedback": "name",
 "content": "feedback_text",
 "timestamp": "created_at",
 "user_id": "user_id"
 }
```

```
video_feedback
{
 "id": "id", 
 "feedback": "name",
 "video_path": "file_path",
 "timestamp": "created_at",
 "duration": "duration"
 }
```

```
audio_feedback
{
 "id": "id", 
 "feedback": "name",
 "audio_path": "file_path",
 "timestamp": "created_at",
 "duration": "duration"
 }
```
---

## 8. Error Handling

### Frontend

1. Display error messages for failed recordings or API requests.
2. Display error when new feedback is empty.
3. Display error when feedback name is empty while saving.
4. Handle UI fallback for users without microphone or camera access.

### Backend

1. Validate input files and texts before processing.
2. Return understandable errors code.

Example response

```
{
  "status": "error",
  "code": "E001",
  "message": "Invalid input data",
  "details": {
    "field": "feedback",
    "error": "Field is required"
  }
}
```

---

## 9. Timeline

### Sprint 1: Research and wireframes.
  - Develop an audio recording functionality.
  - Add Play, Pause, and Stop buttons for the recording feature.
  - Implement secure storage for audio files in the database.
  - Display a list of previously recorded audios.
  - Provide a Play button next to each audio file in the list.
  - Ensure smooth playback functionality for recorded audio.
  - Implement a text input field for entering feedback.
  - Add a Save button to store the feedback.
  - Ensure text feedback is stored securely in the database.
  - Create a list view for displaying previously saved text feedback.
  - Include a preview box where users can read selected text feedback.

### Sprint 2: Implement core functions (recording, transcription).
  - Integrate Whisper into the backend to process stored audio files.
  - Convert recorded audio files to the required frequency (16,000 Hz).
  - Add a "Transcribe" button to audio feedback previews for initiating transcription.
  - Connect the transcription feature between the frontend and backend.
  - Add a theme switcher to the frontend with options for Light, Dark, and High Contrast modes.
  - Implement the Light theme, ensuring consistent styling and smooth transitions.
  - Add High Contrast mode to both Light and Dark themes for better accessibility.

### Sprint 3: Finalize features, fix bugs, mobile responsive and testing.
  - Create a video recorder component with buttons for record, stop, and playback.
  - Add database functionality for video storage and retrieval.
  - Display a list of recorded videos with options for playback.
  - Investigate and implement real-time status updates for the transcription process.
  - Display progress stages like uploading, conversion, and transcription on the frontend.
  - Move feedback lists (audio, text, video) to a separate page.
  - Add a slider to toggle between different feedback types.
  - Improve the visual design of the interface, including consistent styling and clear labels.

---

## 10. Changelog

| Version | Date       | Author | Description                                  |
|---------|------------|--------|----------------------------------------------|
| 1.0     | 2023-11-20 | Team   | Initial draft based on the project scope and objectives. |
| 2.0     | 2024-12-08 | Din    | Updated to include Sprint 1 progress.        |
| 2.5     | 2024-10-01 | Andre  | Updated                                      |
| 3.0     | 2024-16-01 | Andre  | Updated and make final for submission        |

---

## 11. Appendix

1. Svelte documentation https://svelte.dev/docs/svelte/overview.
2. Svelte modal library https://github.com/flekschas/svelte-simple-modal.
3. MediaRecorder documentation https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder.
4. WebRTC API documentation https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API.
5. Using the MediaStream Web API to record screen, camera and audio https://dev.to/antopiras89/using-the-mediastream-web-api-to-record-screen-camera-and-audio-1c4n.
6. Wireframes versions https://www.figma.com/design/BHSrZGE8qXKYVjlXcGILRR/Wireframe?node-id=0-1&p=f&t=tiixB8LcRDDnNiLi-0.
7. Introducing Whisper https://openai.com/index/whisper/.
8. Icons library https://fontawesome.com/icons.