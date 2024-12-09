# Sprint 1 Retrospective

## What Went Well
- **Core Functionalities Delivered**:
  - Successfully implemented **audio recording and playback** using the MediaStream API, including **pause and resume functionality**.
  - Developed a **text feedback input and storage system** with secure database integration.
  - Created lists to display **saved audio and text feedback**.
- **Client Satisfaction**:
  - Delivered a live demo of the prototype during the client meeting, showcasing the core functionalities.
  - Received positive feedback for the intuitive UI prototype and compliance with privacy standards.
- **Framework Decisions**:
  - Adopted **MediaStream API** for audio recording, which met project requirements.
  - Integrated **Whisper (HuggingFace)** for speech-to-text processing, ensuring local data processing and privacy compliance.
- **Collaboration**:
  - Team members aligned on tasks effectively, completing all items in the Sprint 1 backlog.
  - Efficient use of GitLab for task tracking and documentation.

## Challenges
- **Framework Compatibility Issues**:
  - **Shadcn for Svelte** and **Sveltetrap** were abandoned due to compatibility problems, requiring the use of standard Svelte components.
- **API Limitations**:
  - **Web Speech API** was unsuitable due to reliance on Google Cloud, violating privacy policies.
  - **Vosk** required complex dependencies that were out of scope for this project.

## Lessons Learned
- Choose frameworks and APIs that align with the project’s requirements and constraints early in the planning stage.
- Maintain flexibility to pivot when faced with compatibility or dependency issues.
- Regular communication with the client and within the team helps resolve blockers efficiently.

## Action Points for Sprint 2
1. Fine-tune the **existing features** for a fully functional product.
2. Optimize the **Whisper transcription process** for performance and accuracy.
3. Enhance **usability** and fix any identified edge cases.
4. Prepare for final testing and documentation updates.