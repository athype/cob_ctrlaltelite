# **_Sprint 2 Retrospective_**

## **What Went Well**

1. **Core Functionalities Delivered**:
  - Successfully integrated **Whisper** for speech-to-text transcription, allowing users to transcribe audio feedback into text.
  - Completed **theme switching functionality** with Light, Dark, and High Contrast modes, improving accessibility and user customization.
  - Enhanced audio and text feedback workflows, refining user interactions for smoother operations.
2. **Client Satisfaction**:
  - Client appreciated the structured approach to separating feedback types and the improved design consistency.
  - Feedback received for transcription accuracy and the intuitive theme-switching feature during demonstrations.
3. **Refactoring and Code Quality**:
  - Codebase modularized for better maintainability and easier future extensions.
  - Addressed previously reported code inconsistencies, ensuring cleaner and more efficient backend operations.
4. **Testing**:
  - Conducted comprehensive testing to validate Whisper integration and theme-switching capabilities.
  - Improved error handling and performance optimization, ensuring stability in critical workflows.

## **Challenges**

1. **Whisper Integration**:
  - Initial difficulties in preprocessing audio files to match Whisper’s required frequency (16,000 Hz).
  - Resource-intensive transcription led to occasional performance bottlenecks during batch processing.
2. **Database Performance**:
  - Certain bugs arose that created difficulties with the Database’s accessibility and recognition.
  - Iterative testing and debugging ensured database operations remained operational.
3. **UI Design Refinements**:
  - Ensuring seamless transitions between Light, Dark, and High Contrast themes required additional styling adjustments.
  - Addressing usability issues for the theme switcher delayed initial delivery but was resolved in time.

## **Lessons Learned**

1. Early testing of framework and API requirements is crucial to mitigate integration issues.
2. Allocate more time to optimize resource-heavy tasks.
3. Accessibility improvements must be planned with detailed design reviews to ensure consistency across UI elements.

## **Action Points for Sprint 3**

1. Introduce **video recording functionality**, including playback and storage.
2. Refine real-time transcription updates for audio feedback to improve user experience and transparency during processing.
3. Enhance the UI by creating a dedicated feedback page(s).
4. Conduct additional testing for edge cases in transcription and database handling.
5. Finalize all technical and functional design documentation, ensuring alignment with project deliverables.