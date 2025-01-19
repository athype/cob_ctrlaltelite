# Sprint 3 Vision Document

## Project Goal

Sprint 3 aims to enhance usability and introduce advanced features such as video recording, transcription feedback improvements, and refined UI design.

## Objectives

- Improve UI/UX.
- Introduce new feedback deletion features.
- Add combined text, audio, and video feedback.
- Enhance transcription editing.

## Key Features

### **UI and UX Enhancements**
- Simplified, fool-proof interface.
- Workflow improvements with clear feedback visibility.

### **Core Functionalities**

1. **New Recording Button**
   - Updated intuitive design.
   - Dynamic labels.

2. **Delete Feedback**
   - Confirmation dialogs.
   - Notifications after deletion.

3. **Combined Feedback**
   - Text, audio, and video combined entries.
   - Clear UI elements.

### **Advanced Functionalities**

1. **Editing Transcriptions**
   - Interface for modifying transcriptions.
   - Save edits to the database.

2. **Real-time Transcription**
   - Integrated with the audio recorder.

### **Video Feedback Integration**

- Use MediaRecorder API for recording.
- Extend the database schema.
- Create a dedicated UI for video controls.

## User Stories

### **1. Video Feedback Integration**
**Tasks:**
- Implement video recorder.
- Store and retrieve video.
- List recorded videos.

### **2. Real-Time Transcription Updates**
**Tasks:**
- Show transcription progress in real time.
- Display upload, conversion, and processing stages.

### **3. UI Enhancements**
**Tasks:**
- Organize feedback by type.
- Add a slider for switching feedback types.

## Risks and Mitigation

| Risk                         | Impact | Mitigation Strategy                      |
|------------------------------|--------|------------------------------------------|
| Combined feedback complexity | High   | Prioritize UI design and thorough testing. |
| Real-time transcription issues | Medium | Optimize Whisper integration.            |
| Video feedback challenges    | Medium | Use MediaRecorder API prototypes.        |
| Usability inconsistencies    | Medium | Early usability testing and refinements. |

## Success Metrics

- Functional combined feedback implementation.
- Intuitive UI with positive user feedback.
- Seamless feedback management.
- Comprehensive documentation.
