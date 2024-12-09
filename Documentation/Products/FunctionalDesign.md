# Functional Design (BEFORE MEETING)

## 1. Introduction

### 1.1 Problem
Scorion currently lacks a streamlined feedback feature that allows users to record and send their voice,
simplifying the process of providing feedback. By introducing a voice recording functionality,
Scorion can make it easier for users to express their thoughts more naturally and effectively,
facilitating better communication and access to feedback.

### 1.2 Problem Analysis
- Feedback in Scorion is currently restricted to text, which may lack contextual clarity and simplicity 
that audio feedback provides.
- Integrating audio feedback can enhance user experience for both educators and students that
benefit from the flexibility and personal touch of audio feedback, particularly in providing
detailed, nuanced responses.

### 1.3 Context Research
- Scorion is a modern and secure digital portfolio platform for education workplace learning. 
With it, you can send and receive digital feedback helping with the learning progress.
- Audio recording can complement text feedback feature, improving functionality and simplicity.
- Speech-to-text feature for accessibility and flexibility would also bring value.

---

## 2. Solution Overview

### 2.1 Solution Vision
A seamless audio recording feature within Scorion's feedback system that allows users to:
- Record and store feedback audio.
- Optionally convert audio to text using researched speech-to-text api technology.

### 2.2 Scope
- **In-Scope:**
    - Audio recording and playback within the platform.
    - Secure storage of audio files.
    - Integration with Scorion's existing feedback system.
    - (Optional) Speech-to-text conversion.

- **Out-of-Scope:**
    - Audio editing features??
    - Multi-language support for transcription??

### 2.3 Requirements (Non-Functional)
- **Performance:** Low latency for recording and playback.
- **Scalability:** Handle increasing storage needs as more audio files are recorded?
- **Security:** Audio recordings are secure and stored safely. 

### 2.4 Risks and Assumptions
- **Risks:**
    - Technical challenges in integrating audio recording with Scorion's existing infrastructure.
    - No available/compatible free Speech API.
    - 
- **Assumptions:**
    - Scorion's current API supports the addition of audio feedback.
    - Client will provides clear requirements and details after the initial meeting.
    - 

---

## 3. Functional Specs

### 3.1 Business Logic
- **Roles:**
    - Educators: Record and store feedback / Access and listen to audio feedback.
    - Students: Record and store feedback / Access and listen to audio feedback.
- **Rules:**
    - Audio feedback is linked to specific assignments or submissions.
    - Only Scorion authorized users can access or edit feedback? (student/educator)
- **Data:**
    - Audio file (i.g. mp3, wav).
    - Optional transcription data. (Text)

### 3.2 Epics and User Stories (Unrefined)
#### Epic 1: Audio Feedback Recording
- **User Story 1:** As an educator, I want to record audio feedback directly within Scorion so that I can provide more nuanced messages.
- **User Story 2:** As a student, I want to record audio feedback within Scorion so that I can provide clearer messages.
- 
#### Epic 2: Secure Storage and Retrieval
- **User Story 3:** As an educator, I want to listen to the student's audio feedback for a specific subject so that I can review it.
- **User Story 4:** As a student, I want to listen to audio feedback from educators securely so that I can review it.

#### Epic 3: (Optional) Speech-to-Text
- **User Story 5:** As an educator, I want my audio feedback to be converted into text so that it is accessible to all students.
- **User Story 6:** As a student, I want my audio feedback to be converted into text so that it is more accessible to educators.
### 3.3 Mockups and Wireframes (Low-Fidelity)

### -> [ insert beautiful wireframes ] <-

---

## 4. System Architecture

### 4.1 Basic Architecture with Logical Components
- **Frontend:**
    - User interface for audio feedback recording and playback.
    - Audio button in text feedback section in user interface.
- **Backend:**
    - Audio storage and retrieval.
    - Integration with Scorion's existing APIs?

### 4.2 Deploy and Component Diagram

### -> [ insert beautiful component diagrams ] <-

---

## 5. Change Log

| Version | Date       | Author | Description                          |
|---------|------------|--------|--------------------------------------|
| 0.1     | 2023-11-20 | David  | Initial draft based on known context |
| 0.2     |            |        | Updated after client meeting         |

---