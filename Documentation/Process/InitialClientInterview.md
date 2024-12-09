# Client Interview 22.11.2024

---
## Introduction
During the initial meeting, the client described the background of the company and the goals of the current project. 
Then, the representatives of Scorion answered a series of questions from the students and elaborated on the expectations from the final product.
---

## Background of Scorion
The company was started around 25 years ago. Scorion developed a portfolio platform for students, in particular for medical ones. 
The portfolio system uses an approach of **data points**, which are small assignments for which feedback by teachers, instructors and peers are provided.
Each student has a dashboard, where they can see feedback for all the data points. 
This approach allows students to request feedback for specific areas they want to improve on.
Scorion decided to focus on this feature as they found that only receiving an end grade is not as beneficial for medical students as a gradual improvement over the progress of study.
---

## Description of the client's request
Current feedback can only be provided in a text format or via audio recording that relies on a user's device.

### Scorion's requirements for audio feedback feature:

 - Store the audio recorded feedback so that it can be played by a student.
 - Separate the feedback from the student's paper. At the moment, feedback is written directly on an assignment, which makes it not so visible for students. For this reason, Scorion wants to provide a visible feedback feature that can be read easily by a student.
 - Speech recognition for the audio feedback. The client does not want to rely on external devices or systems to recognize audio because of possible privacy infringements.
 - Additional request: create a video feedback feature so that a student can get additional value from feedback with a more personal approach.
 - Scorion wants to fully capture tone of voice and facial expression (for video feedback)

## Scorion's answers to questions

Q: The task description asked to implement transcription of the audio feedback. However, it was mentioned that you already can record and transcribe audio via a device. Can you clarify why and how you want it to be implemented?

A: Currently, you need to rely on your device to record and transcribe audio. So the first reason why it needs to be developed separately is that we do not want confidential data to be processed by servers of external companies.  
Second reason is that this recording approach does not handle interruptions well. There is no proper way to stop a recording when a person speaking is interrupted, which means that the transcribed recording would contain a lot of unnecessary information recorded.
Also, Scorion follows ISO27001 security management standard which means that the confidential data (in particular medical) cannot be sent to the third parties.

Q: Is there any brandbook that has to be followed?

A: There is a brand design, with a distinctive style and colors, but there is no style guide.

Q: Do you want the teams to develop the feature in a way that can be easily integrated into the existing software system, or do you want it completely separate?

A: Make it separate. It is a proof of concept to generate more ideas, so please keep it as a distinct feature.

Q: So after the project is developed, you will be able to integrate it yourself?

A: No, this is just a proof of concept and integration is not a part of it. 

Q: You mentioned that the primary users of the portfolio system are medical system. And you want the feedback to be for a specific assignment. However, I imagine medical students do not always have a textbook assignment ant it can be a supervised lab as well. Is that right?

A: Not exactly, it really depends on the curriculum of a particular medical school. On the next meeting, a demo of the existing platform will be shown.

Q: Would you like the feature to be linked to a specific piece of text in an assignment?

A: No, we just want to see how the feature can be made separately. 

Q: We were told that we have to use Svelte for this project. But are we allowed to use component libraries?

A: Yes. We don't use Svelte, we use Vue and Quasar component library.

Q: Is the only restriction for API that can be used for the data to not go to third parties?

A: Yes. Preferably no data going to third parties at all, or as little as possible.

Q: What would success in this project look like to you? Are there any metrics, user feedbacks etc.?

A: No, there are no fixed rubrics. Success is determined by the end product and by the way a team decided to create it. At the end each team might be asked to give a presentation and the winner will be chosen by voting.
It is successful when it looks good, is easy to use and doesn't crash. Also, security is important. Make sure that what you build works.

Q: Is there any other language besides English that we have to support?

A: If possible, Dutch and German, but this is optional.

Q: Can a user edit anything after recording?

A: It is not part of the project, our system will handle it. The primary part of assignment is data entry.

Q: Would you like a regular update on progress?

A: We have one meeting in between and one in the end to update on the progress.

Q: Would you like to have any other documentation, such as user manuals?

A: No, we do not need any additional documentation. But it is important for us to explain your technical choices during a presentation.

Q: Do we need to follow the frameworks that you already use?

A: No, because you are already asked to use Svelte by the assignment. Just for reference, our backend uses PHP with Symphony framework and our databases are MariaDB.

Q: Do we have any restrictions on who can give feedback to whom?

A: No, there aren't any. Students can give feedback to each other as well.







