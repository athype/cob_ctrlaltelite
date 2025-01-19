# Functional Design

## 1. Introduction

### 1.1 Problem
Scorion currently lacks an intuitive and secure feedback system that allows students and educators to provide comprehensive feedback through multiple channels (audio, text, and video).  
The current feedback system relies on third-party services for audio recording and transcription, which raises privacy concerns and non-compliance with ISO27001 security standards.

### 1.2 Problem Analysis
- The current system only supports text feedback, which lacks the clarity and depth that audio and video can provide.
- The dependency on third-party audio tools introduces security risks, potential data leaks, and breaches of privacy regulations.
- The lack of integrated audio transcription prevents users from efficiently converting their speech into text within the platform.
- Users currently cannot manage feedback efficiently, lacking features such as deleting and combining multiple types of feedback.

### 1.3 Context Research
- Scorion is a digital portfolio platform primarily used by medical students and educators to track progress through data points.
- Existing portfolio systems prioritize final grading, whereas Scorion focuses on **continuous improvement** by collecting frequent feedback across multiple assignments.
- The proposed system aims to provide a self-contained, locally processed feedback system that enhances usability while ensuring security compliance.

---

## 2. Solution Overview

### 2.1 Solution Vision
The project aims to create a proof-of-concept feedback feature within Scorion that:
- Allows users to **record, store, and play audio feedback securely** using the MediaStream API.
- Provides text-based feedback input and storage with the ability to **edit transcriptions**.
- Supports **video feedback recording**, playback, and storage.
- Enables a combined feedback feature where users can include **text, audio, and video** in a single entry.
- Provides an intuitive and user-friendly interface that meets accessibility standards with **theme-switching functionality** (Light, Dark, High Contrast).

### 2.2 Scope

#### **In-Scope:**
- Audio, text, and video feedback recording, playback, and secure storage.
- Transcription of recorded audio via **HuggingFace Whisper** integrated into the platform.
- Basic UI improvements to enhance usability (highlighting new feedback, easier navigation).
- Dedicated feedback page with the ability to delete and manage feedback items.
- Combining multiple feedback types (text, audio, and video) into a single feedback entry.

#### **Out-of-Scope:**
- Integration with Scorion's production environment.
- Advanced editing features (e.g., trimming audio/video).
- Support for multiple language transcriptions beyond English.

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
  - Manage and delete feedback entries.
  - Use transcription to convert audio feedback into text.
- **Students:**
  - Submit feedback using text, audio, or video.
  - Review and act upon feedback from educators.

#### **Rules:**
- Feedback must be stored securely and accessible only to authorized users.
- Feedback can contain one or multiple types (audio, video, text).
- Deleting feedback requires confirmation to prevent accidental loss.

#### **Data Involved:**
- **Audio Feedback:** Stored in `.mp3` or `.wav` formats.
- **Video Feedback:** Stored in `.mp4` format.
- **Text Feedback:** Stored securely in the database.
- **Metadata:** Associated with each feedback entry (timestamps, user ID).

---

### 3.2 Epics and User Stories

#### Epic 1: Audio Feedback
- **User Story 1:** As a user, I want to record and playback audio feedback securely.
  - Tasks:
    - Develop audio recording and playback features.
    - Ensure secure storage of audio files.

- **User Story 2:** As a user, I want my audio feedback to be transcribed into text for better accessibility.
  - Tasks:
    - Implement transcription functionality using Whisper.
    - Display transcription results with an option to edit.

#### Epic 2: Video Feedback
- **User Story 3:** As a user, I want to record video feedback to provide a more personal touch.
  - Tasks:
    - Implement video recording with playback controls.
    - Secure video storage in the database.

#### Epic 3: Feedback Management
- **User Story 4:** As a user, I want to delete feedback entries to manage my workspace.
  - Tasks:
    - Add delete functionality with confirmation prompts.
    - Provide notifications for successful deletions.

- **User Story 5:** As a user, I want to combine text, audio, and video feedback in a single entry.
  - Tasks:
    - Develop UI components for combined feedback.
    - Adjust database schema to support mixed feedback types.

---

### 3.3 Mockups and Wireframes (Low-Fidelity)
#### Mockups
![mockup1.png](..%2Fmd-images%2Fmockup1.png)
![mockup2.png](..%2Fmd-images%2Fmockup2.png)

#### Wireframes
![wireframe.png](..%2Fmd-images%2Fwireframe.png)

---

### Final Figma Mockup Designs

**Dark Mode**
![dark_mode.png](..%2Fmd-images%2Fdark_mode.png)

**Light Mode**
![light_mode.png](..%2Fmd-images%2Flight_mode.png)

**High-Contrast Mode**
![high_contrast.png](..%2Fmd-images%2Fhigh_contrast.png)

---

## 4. System Architecture

### 4.1 Basic Architecture with Logical Components
- **Frontend:**
  - Built using Svelte with UI components for feedback recording and playback.
  - Includes theme-switching functionality (Light, Dark, High Contrast).
- **Backend:**
  - Node.js and Express.js for managing API requests.
  - SQLite for secure storage of feedback and metadata.

### 4.2 Deployment and Component Diagram
- **Deployment Details:**
  - Local SQLite database storage.
  - Proof-of-concept hosted in a local or sandbox environment.

---

## 5. Changelog

| Version | Date       | Author | Description                                                                 |
|---------|------------|--------|-----------------------------------------------------------------------------|
| 0.1     | 2023-11-20 | David  | Initial draft based on known context.                                       |
| 0.2     | 2023-12-01 | Din    | Updated based on client meeting, Sprint 1 vision document and user stories. |
| 0.3     | 2023-12-04 | David  | Added low-fidelity mockups, wireframes and updates to introduction          |
