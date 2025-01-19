# Vision for Sprint 1

**Project Client on Board**  
**Saxion ICT (2nd Year) - TeamCtrl+Alt+Elite**

## Vision for Sprint 1

Sprint 1 focuses on building the foundational features of the project, which are audio and text feedback recording. The primary deliverables are a working prototype that lets users record and store audio feedback, type and save text feedback, and see previously saved feedback through accessible lists.

### **Backlog Items**

#### **U1. Audio Feedback Recording**
**Tasks:**
- Develop an audio recording functionality.
- Add Play, Pause, and Stop buttons.
- Implement secure storage for audio files.

#### **U2. Audio Playback**
**Tasks:**
- Display a list of previously recorded audios.
- Provide a Play button next to each file.
- Ensure smooth playback.

#### **U3. Text Feedback Entry**
**Tasks:**
- Implement a text input field.
- Add a Save button.
- Ensure secure storage.

#### **U4. Text Feedback Review**
**Tasks:**
- Create a list view for saved text feedback.
- Include a preview box.

### **Framework and Technology Choices**

- **Frontend:** Shadcn for Svelte
- **Speech Recognition:** Evaluating Whisper, PocketSphinx, and DeepSpeech.
- **Database:** SQLite

### **Risks and Mitigation Strategies**

| Risk                      | Impact | Mitigation Strategy                        |
|---------------------------|--------|--------------------------------------------|
| Incomplete implementation | High   | Focus on core features and prioritize testing. |
| Speech-to-text complexity | Medium | Defer to later sprints and select reliable libraries. |
| UI usability issues       | Medium | Conduct manual testing with user feedback. |
| Database performance      | Medium | Limit file sizes and optimize queries. |

### **Deliverables**

1. **Functionality:**  
   - Audio recording and playback  
   - Text feedback input and storage  
2. **UI Prototype:**  
   - Visually intuitive prototype  
3. **Codebase:**  
   - Fully functional code  
4. **Documentation:**  
   - Updated functional and technical design
