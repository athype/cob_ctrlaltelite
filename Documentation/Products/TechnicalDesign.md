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
- **Client**: Scorion, which formulates the requirements for the project.\
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
//TODO: describe the components
### Hardware Architecture (Deploy)
![hardware_architecture.png](..%2Fmd-images%2Fhardware_architecture.png)
//TODO describe the hardware
### Software Architecture

#### Overview
- Svelte for the frontend interface.
- Node.js and Express.js for the backend.
- SQLite for database storage.

#### Libraries
- MediaStream API for audio recording and playback.
- Whisper library (HuggingFace) for speech-to-text functionality.

#### Frameworks
- **Frontend**: Svelte components.
- **Backend**: Node.js and Express.js.

#### Components
//TODO: list all components, and name as they are named in the project
**Reusable Components:**
1. **Button**:
- Supports icons, labels, and actions on press.
- Customizable colors for different contexts (e.g., Record, Stop, Play, Send).

2. **Scrollable Section**:
- Displays a list of items (e.g., feedback entries).

3. **Item in Scrollable Section**:
- Represents individual feedback entries.

**Non-Reusable Components:**
1. **Audio Recording Field**:
- Includes buttons for Record, Stop, Play, and Send.
- Displays an equalizer during recording.
- Provides a text input box for optional transcriptions.
2. **Text Output Field**:
- Displays a list of saved text feedback entries.

### APIs

- **MediaStream API**: Handles audio recording and playback.
- **Whisper API** (HuggingFace): Provides local speech-to-text functionality.

### Information Architecture

//TODO: add diagram and describe it
- Data Types:
    - Audio files (e.g., `.wav`).
    - Text feedback entries.
- Data Navigation:
    - Accessible via intuitive UI lists for saved audio and text feedback.

### Security Architecture
//TODO: describe security, explain that all data is processed and stored locally to ensure confidentiality, and that no third-party servers are used for sensitive data.

- All data is processed and stored locally to ensure confidentiality.
- No third-party servers are used for sensitive data.

### Performance
//TODO: describe performance of the whisper model that we use (how fast it is, how much memory it uses, etc.)

- Audio recording and playback must be low-latency.
- Whisper integration should handle transcription efficiently, even with larger audio files.

---

## 5. System Design

### Database Design
//TODO: class diagram of the database
- **Database**: SQLite is used to store recordings and textual feedback.
- **Reasoning**:
    - Ease of integration and maintenance.
    - File-based storage for enhanced security.

### User Interface Design
//TODO: add and describe wireframes. Explain why we put components where ther are, and why we changed it later etc. 
From technical perspective, not user perspective. 
- **Principles**:
    - Focus on simplicity and intuitiveness.
    - Clear labeling and purposeful placement of buttons.
- **UI Elements**:
    - Lists for displaying saved feedback.
    - Buttons for audio actions (Record, Play, Pause, Stop).

### Software Design
//TODO: explain what software components are there (backend, frontend, etc.)

- Modular and extendable backend structure.
- Reusable Svelte components for the frontend.

### Security Design
//TODO: explain how we ended up implementing it taking into account the security requirements
- Local data processing and storage to align with privacy requirements.
- ISO27001 compliance for system security.

---

## 6. Data Flow
//TODO: add sequence diagrams for the data flow
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
//TODO: describe text feedback validation on frontend
1. Display error messages for failed recordings or API requests.
2. Handle UI fallback for users without microphone or camera access.

### Backend
//TODO: describe error handling on backend
1. Validate input files and texts before processing.
2. Return understandable errors code.

---

## 9. Timeline
//copy freaking parts of backlogs we had
https://docs.google.com/document/d/10fQPt7yL3RTi0cYwei1daPV0w_FIDbVmGtZ0hO8Z6fA/edit?tab=t.0
https://docs.google.com/document/d/1sl-zKipzTvmlL12tQw9ov78GFGaSp-b0Db9KUAIsoZo/edit?tab=t.0#heading=h.2u2qql3xgmi6
https://docs.google.com/document/d/1Fmdu2oIvaCh1dLgFWBOOzhFj99Wee4R-kk46L-lBt0s/edit?tab=t.0
- Srpint 1: Research and wireframes.
- Sprint 2: Implement core functions (recording, transcription).
- Sprint 3: Finalize features, fix bugs, mobile responsive and testing.


---

## 10. Changelog

| Version | Date       | Author | Description                                  |
|---------|------------|--------|----------------------------------------------|
| 1.0     | 2023-11-20 | Team   | Initial draft based on the project scope and objectives. |
| 2.0     | 2024-12-08 | Din    | Updated to include Sprint 1 progress.        |
| 2.5     | 2024-10-01 | Andre  | Updated                                      |
| 3.0     | 2024-16-01 | Andre  | Updated and make final for submission        |