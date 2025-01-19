# Sprint 3 Retrospective

## What Went Well

### 1. Successful Feature Implementation
- The **new recording button** was implemented with an improved design, making it more intuitive for users.
- **Combined feedback functionality** (text, audio, video) was successfully integrated, allowing users to submit and manage multiple feedback types in a single entry.
- Users can now **edit transcriptions**, providing more flexibility and control over their audio feedback.
- The UI revamp focused on making the interface more intuitive and “fool-proof,” with additional tooltips and on-screen guidance.

### 2. Video Feedback Integration
- Video recording, playback, and storage were successfully integrated using the **MediaRecorder API**, ensuring smooth functionality and compatibility with existing features.
- A dedicated UI for managing video feedback was created, making it easy for users to interact with their recordings.

### 3. Improved User Experience and Accessibility
- The feedback management system was enhanced with improved navigation and an intuitive layout.
- Users can now toggle between feedback types using a newly introduced slider, improving accessibility and usability.
- The UI was refined based on early usability testing, leading to fewer reported issues from stakeholders.

### 4. Testing and Stability Improvements
- Rigorous testing was conducted to ensure stability across all functionalities, particularly around audio and video feedback workflows.
- The system was tested for edge cases, leading to improved error handling and performance optimizations.

### 5. Client Satisfaction
- The final client demo received positive feedback, with clients appreciating the ease of use and added flexibility in managing feedback.

---

## Challenges Faced

### 1. Complexity of Combined Feedback Integration
- Merging text, audio, and video into a single feedback entry required substantial restructuring of the database schema and frontend components.
- Synchronization between different feedback types initially caused performance issues, which required multiple iterations to resolve.

### 2. Real-Time Transcription Performance Issues
- Implementing real-time transcription with the Whisper API introduced processing delays, especially for longer recordings.
- Optimization efforts were required to balance performance and accuracy.

### 3. UI/UX Refinements Took More Time Than Expected
- Ensuring consistency between elements and components etc across various screen sizes and themes (Light, Dark, High Contrast) required additional design iterations.
- Some features, such as transcription editing, required usability testing and feedback loops to refine.

### 4. Storage Limitations
- Managing large audio and video files locally might require additional work in terms of compression and retrieval optimization in the future.

---

## Lessons Learned

### 1. Early Usability Testing Is Crucial
- Conducting usability testing in the early stages of feature development helps identify potential user friction points and avoid rework later.

### 2. Modular Design for Scalability
- Keeping the architecture modular allowed for easier implementation of new features and modifications without affecting core functionalities.

### 3. Performance Considerations
- Balancing real-time processing (such as transcription) with system responsiveness should be prioritized from the start to avoid delays.

### 4. Clear Documentation Saves Time
- Detailed documentation of API endpoints and UI components helped the team stay aligned and improved onboarding for new developers.

---

## Conclusion

Sprint 3 was a successful milestone, achieving key objectives while facing and overcoming significant challenges. The team delivered a functional and intuitive feedback management system, satisfying client expectations and improving the user experience.
