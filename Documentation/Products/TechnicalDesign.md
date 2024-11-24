# 1. Introduction
## Project description
The project is focused on developing a text and voice feedback feature with optional voice recognition for the company Scorion.
Scorion develops a student portfolio system that aims to provide feedback not only for the final grading, but for smaller parts of each task called data points. 
The data point approach is used to allow students to get fuller picture of their progress. For this reason, feedback is a primary focus. 

## Objectives
To send feedback, Scorion currently relies on external systems, such as sending forms or using a mobile device's speech recognition tool.
For this project, Scorion wants to detach from the use of third-party servers and build their own set of feedback features.
The project is a proof of concept, so the development of the specified features is to be done separately from the existing software.
The objectives can be defined as follows:

- Provide voice feedback feature that allows to store the recording
- Provide text input feature that allows to type in and store feedback
- Optionally include a voice-to-text conversion for audio feedback
- Optionally include a video feedback feature
- Preserve confidentiality of users by avoiding the use of third-party services

## Scope
This document describes the technical design part of the project. It explains the choice of frameworks and components, architectural decisions and their correspondence with requirements.

## Stakeholders
- Client - company, named Scorion. Formulates the requirements for the project.
- Lecturer - Eelco Jannink. Defines the primary frameworks to be used, is an intermediary in the communication with the client.
# 2. General Overview and Approach
The general approach when making technical decision is basing them on client's requirements. 
The choice of frameworks is an important part of a project's architecture as it determines how well can a feature be realized and how easily it can be integrated with the other features.
Another consideration is to keep project maintainable and extendable. It can be achieved by keeping the project modular, frontend and backend independent and making reusable components.
# 3. Design Considerations
To design a system for Scorion's audio and textual feedback features, an organized backend and frontend parts are necessary.

## Frontend
Frontend is created using Svelte, so the design of reusable components is crucial.
Each component must be modular, reusable and reasonable in its context.
It is important to keep styling either linked to a particular component, or being applicable to the whole project.
When writing scripts, the main focus is to ensure smooth and error-free behaviour.
This is prioritized over how advanced a script is.
Another key consideration is user experience. The interface has to be intuitive, visible and easy to use.
## Backend
Backend is designed with Node.js and Express. 
The backend must be responsive and use frameworks for audio recording and speech recognition that provide optimal performance.
Backend must be modular, which improves code extendability and maintainability.
For the same reason, it is important to keep code cleanliness and optimize algorithms whenever possible.

# 4. System Architecture

## a. Logical View (Functional Components)
Conceptual diagram goes here.
## b. Hardware Architecture (Deploy)
Added when deploy is decided on.
## c. Software Architecture
### Overview
### Libraries
### Protocols
The system must use ISO27001 security protocol as it is a standard set y the client.
### Frameworks
### Components
  
**Button**:
  - has a field for icon to display (optionally can be no icon)
  - Has a field for label (optionally no label)
  - Has an action on press
  - (maybe) selectable and default colors
  - Used for record, stop, play and send buttons

**Scrollable section**

**Item in the scrollable section**

_Non-reusable Svelte components:_

**Audio recording field**
- Has button record that dynamically changes to stop/play
- Has button to send
- Has an equalizer
- Text input field
- Has text box for input
- Has a send button
**Text output field for list with saved text**

### APIs

## d. Information Architecture
- What data is provided, how, and navigation details.

## e. Security Architecture
To protect the confidentiality of users, no third-party servers are used.
## f. Performance

# 5. System Design

## a. Database Design
A Sqlite database is used to store recordings and textual feedback. 
This database was chosen for its ease of integration, maintenance and security benefits. 
The database is stored as a file on the server-side, which keeps it stored securely 
## b. User Interface Design
The design of the user interface focuses primarily on the ease of use. 
Whenever possible, the buttons are placed and labeled in a way that shows their purpose.
## c. Hardware Design

## d. Software Design

## e. Security Design

# 6. Changelog
