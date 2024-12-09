# Technical Design (Updated After Sprint 1)

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

The general approach when making technical decisions is to base them on the client’s requirements.  
The choice of frameworks is a critical part of the project’s architecture as it determines how well features can be realized and how easily they can be maintained.  

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

### a. Logical View (Functional Components)
A conceptual diagram is required for this section.

### b. Hardware Architecture (Deploy)
To be decided once deployment details are finalized.

### c. Software Architecture

#### Overview
- Svelte for the frontend interface.
- Node.js and Express.js for the backend.
- SQLite for database storage.

#### Libraries
- MediaStream API for audio recording and playback.
- Whisper library (HuggingFace) for speech-to-text functionality.

#### Protocols
- Compliance with ISO27001 security standards.

#### Frameworks
- **Frontend**: Svelte components.
- **Backend**: Node.js and Express.js.

#### Components

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

---

### APIs
- **MediaStream API**: Handles audio recording and playback.
- **Whisper API** (HuggingFace): Provides local speech-to-text functionality.

### d. Information Architecture
- Data Types:
  - Audio files (e.g., `.wav`, `.mp3`).
  - Text feedback entries.
- Data Navigation:
  - Accessible via intuitive UI lists for saved audio and text feedback.

### e. Security Architecture
- All data is processed and stored locally to ensure confidentiality.
- No third-party servers are used for sensitive data.

### f. Performance
- Audio recording and playback must be low-latency.
- Whisper integration should handle transcription efficiently, even with larger audio files.

---

## 5. System Design

### a. Database Design
- **Database**: SQLite is used to store recordings and textual feedback.
- **Reasoning**:
  - Ease of integration and maintenance.
  - File-based storage for enhanced security.

### b. User Interface Design
- **Principles**:
  - Focus on simplicity and intuitiveness.
  - Clear labeling and purposeful placement of buttons.
- **UI Elements**:
  - Lists for displaying saved feedback.
  - Buttons for audio actions (Record, Play, Pause, Stop).

### c. Hardware Design
To be determined.

### d. Software Design
- Modular and extendable backend structure.
- Reusable Svelte components for the frontend.

### e. Security Design
- Local data processing and storage to align with privacy requirements.
- ISO27001 compliance for system security.

---

## 6. Changelog

| Version | Date       | Author | Description                                                        |
|---------|------------|--------|--------------------------------------------------------------------|
| 0.1     | 2023-11-20 | Team   | Initial draft based on the project scope and objectives.           |
| 0.2     | 2024-12-08 | Din   | Updated to include Sprint 1 progress. |

