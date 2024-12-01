# Functional Design (Updated After Client Meeting)

## 1. Introduction

### 1.1 Problem
Scorion currently lacks an intuitive feedback feature that separates audio feedback from assignment text and ensures compliance with strict privacy standards. While the current system supports text-based feedback, audio feedback relies on external devices and lacks integration with Scorion's platform. A new solution is needed to improve user experience and align with data privacy requirements.

### 1.2 Problem Analysis
- Current feedback is limited to text or externally recorded audio, which may lack the contextual nuance and convenience of an integrated solution.
- Existing audio recording workflows rely on third-party services, which pose privacy risks (violating ISO27001 compliance).
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
  - Audio recording, playback, and secure storage of audio files.
  - Text feedback input, storage, and retrieval.
  - Displaying lists of recorded audio and text feedback for easy access.
  - Standalone proof-of-concept, not integrated into Scorion’s existing platform.

- **Out-of-Scope:**
  - Integration with Scorion's existing system.
  - Audio editing or advanced playback controls.
  - Multi-language support for speech-to-text transcription (optional for future work).

### 2.3 Requirements (Non-Functional)
- **Performance:** Low-latency audio recording and playback.
- **Scalability:** Efficient storage and retrieval of feedback as the system scales.
- **Security:** Fully local processing for audio recordings and transcription, with no data sent to third parties.
- **Usability:** Intuitive user interface that aligns with Scorion's brand style.

### 2.4 Risks and Assumptions
- **Risks:**
  - Complexity of integrating local speech-to-text libraries (e.g., Whisper, DeepSpeech).
  - Potential UI usability issues during development.
  - Database performance challenges with large audio files.
- **Assumptions:**
  - SQLite database will be sufficient for storing metadata and audio/text feedback securely.
  - The client is primarily focused on core functionality and user experience for the proof-of-concept.

---

## 3. Functional Specs

### 3.1 Business Logic
- **Roles:**
  - Educators: Record and store audio feedback; access and listen to feedback.
  - Students: Record and store audio feedback; access and listen to feedback.
- **Rules:**
  - Audio feedback is separate from assignment text for greater visibility.
  - Only authorized users can access feedback stored in the system.
- **Data:**
  - Audio files (e.g., `.mp3`, `.wav`).
  - Text feedback entries (associated with audio feedback or standalone).

### 3.2 Epics and User Stories
#### Epic 1: Audio Feedback Recording and Playback
- **User Story 1:** As a user, I want to record audio feedback so that I can capture my message more naturally using tone of voice.
  - **Tasks:**
    - Develop audio recording functionality.
    - Add Play, Pause, and Stop buttons for recordings.
    - Securely store audio files in the database.
- **User Story 2:** As a user, I want to listen to recorded audio feedback so that I can revisit it later.
  - **Tasks:**
    - Display a list of recorded audio files.
    - Provide a Play button for each file.
    - Ensure smooth playback functionality.

#### Epic 2: Text Feedback Input and Retrieval
- **User Story 3:** As a user, I want to type feedback so that I can express my thoughts directly and conveniently.
  - **Tasks:**
    - Implement a text input field for feedback.
    - Add a Save button to store text feedback securely.
- **User Story 4:** As a user, I want to view saved text feedback so that I can revisit my previous inputs.
  - **Tasks:**
    - Create a list view for displaying saved text feedback.
    - Include a preview box for selected feedback.

#### Epic 3: Speech-to-Text (Future Scope)
- **User Story 5 (Optional):** As a user, I want audio feedback transcribed into text locally so that it remains private and accessible.

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

| Version | Date       | Author      | Description                                                 |
|---------|------------|-------------|-------------------------------------------------------------|
| 0.1     | 2023-11-20 | David       | Initial draft based on known context.                      |
| 0.2     | 2023-11-27 | Din | Updated based on client meeting, Sprint 1 vision document and user stories. |

