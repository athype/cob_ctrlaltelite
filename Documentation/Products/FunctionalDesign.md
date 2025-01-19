# Functional Design

## 1. Introduction

### 1.1 Problem
Scorion currently lacks an intuitive and secure feedback system that allows students and educators to provide comprehensive feedback through multiple channels (audio, text, and video).  
The current feedback system relies on third-party services for audio recording and transcription, which raises privacy concerns and non-compliance with ISO27001 security standards.

### 1.2 Problem Analysis
- The current system only supports text feedback(recording was done externally), which lacks the clarity and depth that audio and video can provide.
- The dependency on third-party audio tools introduces security risks, potential data leaks, and breaches of privacy regulations.
- The lack of integrated audio transcription prevents users from efficiently converting their speech into text within the platform.
- Users currently cannot manage feedback efficiently, lacking features such as combining multiple types of feedback.
- There is no way to stop or resume recordings, which leads to unnecessary content being captured during interruptions.

### 1.3 Context Research
- Scorion is a digital portfolio platform tailored for students, especially in the medical field, emphasizing gradual feedback instead of end grades.
- The platform provides dashboards for students to review feedback on data points (assignments or supervised tasks).
- An integrated, privacy-compliant audio recording system will enhance the platform’s usability and align with its educational goals.

---

## 2. Solution Overview

### 2.1 Solution Vision
The project aims to create a proof-of-concept feedback feature within Scorion that:
- Allows users to **record, store, and play audio feedback securely** using the MediaStream API.
- Provides text-based feedback input and storage.
- Supports **video feedback recording**, playback, and storage using MediaRecorderAPI.
- Enables a combined feedback feature where users can include **text, audio, and video** in a single entry.
- Provides an intuitive and user-friendly interface that meets accessibility standards with **theme-switching functionality** (Light, Dark, High Contrast).
- An interface with details and features that have a positive impact on statisfying user experience.

### 2.2 Scope

#### **In-Scope:**
- Audio, text, and video feedback recording, playback, and secure storage.
- Transcription of recorded audio via **Whisper** integrated into the platform.
- UI improvements to enhance usability (highlighting new feedback, visual effects, tabs/submenus, pop-up modals, indicators, easier navigation).
- Dedicated feedback page with the ability to manage feedback items.
- Combining multiple feedback types (text, audio, and video) into a single feedback entry.
- Support for another language transcription beyond English (Dutch).
- Feature for editing text feedbacks.

#### **Out-of-Scope:**
- Integration with Scorion's production environment.
- Advanced editing features (e.g., trimming audio/video).
- Transcription of video feedback to text.
- Support for more than 2 languages.

### 2.3 Requirements (Non-Functional)
- **Performance:** Ensure low-latency recording, playback, and transcription processing.
- **Security:** Fully local processing of audio and video to ensure data privacy compliance (ISO27001).
- **Usability:** A user-friendly interface that provides clear actions and workflows.
- **Scalability:** Efficient handling of audio and video storage without impacting system performance.
- **Accessibility:** Compliance with accessibility guidelines to support diverse user needs.

### 2.4 Risks and Assumptions

#### **Risks:**
- Complexity in integrating real-time transcription within the recording workflow.
- Potential storage challenges due to the growing size of audio and video files.
- UI complexity when adding combined feedback features.

#### **Assumptions:**
- SQLite will be sufficient to store metadata and feedback securely.
- Users will find the proof-of-concept sufficient without immediate integration into the existing Scorion platform.
- Whisper transcription library will handle common accents and speech variations accurately.

---

## 3. Functional Specs

### 3.1 Business Logic

#### **Roles:**
- **Educators:** 
  - Record, store, and review feedback.
  - Manage feedback entries.
  - Use transcription to convert audio feedback into text.
- **Students:**
  - Submit feedback using text, audio, or video.
  - Review and act upon feedback from educators.

#### **Rules:**
- Feedback must be stored securely and accessible only to authorized users.
- Feedback can contain one or multiple types (audio, video, text).

#### **Data Involved:**
- **Audio Feedback:** Stored in `.wav` format.
- **Video Feedback:** Stored in `.webm` format.
- **Text Feedback:** Stored securely in the database.
- **Metadata:** Associated with each feedback entry.

---

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

---

### 3.3 Mockups and Wireframes (Low-Fidelity)
#### Mockups
![mockup1.png](..%2Fmd-images%2Fmockup1.png)
![mockup2.png](..%2Fmd-images%2Fmockup2.png)

#### Wireframes
- Dark mode
- ![wireframe_final.png](..%2Fmd-images%2Fwireframe_final.png)
- White mode
- ![wireframe_final2.png](..%2Fmd-images%2Fwireframe_final2.png)
- High contrast mode
- ![wireframe_final3.png](..%2Fmd-images%2Fwireframe_final3.png)

---

## 4. System Architecture

### 4.1 Basic Architecture with Logical Components
- **Frontend:**
  - Built using Svelte with UI components for feedback recording and playback.
  - Includes theme-switching functionality (Light, Dark, High Contrast).
  - Features for enhancing user experience (visual effects, tabs/submenus, pop-up modals, highlighiting, indicators, timer, etc)
- **Backend:**
  - Node.js and Express.js for managing API requests.
  - SQLite for secure storage of feedback and metadata.
  - Whisper for Audio feedback to text transcription.
  - MediaStream API for handling audio capture and recording.
  - MediaRecorder API for capturing video feedback.

### 4.2 Deployment and Component Diagram
  - Deployment Diagram
  - ![deployment_diagram.png](..%2Fmd-images%2Fdeployment_diagram.png)
  - Component Diagram
  - ![Component_diagram.png](..%2Fmd-images%2FComponent_diagram.png)
  **Deployment Diagram Explanation:**
  - Represents the system's deployment structure.
  - Shows user interaction with the frontend.
  - Frontend communicates with the backend via RESTful API.
  - Backend interacts with the SQLite database and external APIs.
  - Local storage handles audio and video files.
  
  **Component Diagram Explanation:**
  - Breaks down the system into logical components.
  - Frontend (Svelte): Handles UI components such as recorders, feedback inputs, themes, etc.
  - Backend (Express.js): Organized into controllers, routes, and services for handling business logic.
  - Database (SQLite): Stores structured feedback data.
  - External Libraries: Handles audio/video processing and transcription.

---

## 5. Changelog

| Version | Date       | Author | Description                                                                 |
|---------|------------|--------|-----------------------------------------------------------------------------|
| 0.1     | 2024-11-20 | David  | Initial draft based on known context.                                       |
| 0.2     | 2024-12-01 | Din    | Updated based on client meeting, Sprint 1 vision document and user stories. |
| 0.3     | 2024-12-04 | David  | Added low-fidelity mockups, wireframes and updates to introduction          |
| 1.0     | 2025-01-19 | Din    | Finilized the functional Design        |
