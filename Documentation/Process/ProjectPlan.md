# Project Plan

---

## The TEAM

In a project, teamwork is the backbone of success. Smooth communication, enhanced productivity, and a professional working environment are ensured by having a shared understanding of team's expectations and responsibilities. Finding common ground gives team members clarity on their roles, duties and expectations of one another while also assisting  them in directing the team's efforts toward the project's goals. 
<br><br>
Each member should have a clear understanding of their responsibilities which helps reduce confusion and overlap of tasks within the group. That is why every group member must agree on the [Code of Conduct](Code%20of%20Conduct.md) and take responsibility on following the given rules. 
With clear expectations, each member can be held accountable for their deliverables and performance. 
A clear communication within the group also plays an important role as a sense of belonging, making individuals feel valued and motivated to give their best in the project. 
Lastly, having common ground will minimize misunderstandings and help resolve conflicts quickly, which is very important since the deadline spare no time for problems. 
<br><br>
Being aware of these expectations provides the team with a precise standard by which to evaluate everyone's performance. Individuals and together as a team, can be proud of each member's contribution when they meet or surpass the objectives. If issues arise, this can be seen as a reflection that provides a constructive foundation for feedbacks and improvements.

---

## The Problem

### 1. Task
- The client aims to improve the way feedback is captured within the Scorion environment by incorporating audio recordings. Currently, feedbacks are typed in or recorded as text, converted to text by a device and saved as text.
However, these methods present 2 main challenges:
    - **Inadequate Speech-to-text Implementation**: Devices often fail to accurately convert speech to text due to language accents, technical errors and so on. Besides, some devices also lack capability for speech-to-text function.
    - **Missing Audio Feedback**: There is not a function to record, store and access audio clips, which limit the richness of giving feedback as well as replying to the given feedbacks.
- The proposed solution is to use AI as a speech-to-text API, therefore enable the ability to record and store text transcription, ensuring usability and accessibility for a diverse set of devices.

### 2. The Stakeholders
- **Primary Stakeholders**:
    - **Scorion Developers**: Provide feedback to student. Introduce students to Scorion's working environment. Receive the product.
    - **Students**: Receive feedback. Responsible for implementing the solution.
- **Secondary Stakeholders**:
    - **Saxion Teachers**: Grade the project based on the product given to the client.
    - **Compliance and Legal Team**: Ensure the solution adheres to GDPR data privacy regulations.

---

## Risks
| Risks                                   | Impact                                                         | Prevention Measures                                                                                                    |
|:----------------------------------------|:---------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| Inaccurate speech-to-text transcription | High (could cause poor user experience)                        | Use proven APIs; support editing and multiple languages|
| Dependence on third-party APIs for speech-to-text functionality| High (downtime or changes in APIs could disrupt functionality) | Regularly monitor APIs for updates and maintain version compatibility or use multiple API providers to ensure redundancy|
| Compatibility issues                    | High (could cause problem using the functions)                 | Test across devices and browsers, plan fallback options                                                                |
| Data security breaches                  | High (legal repercussions and loss of user trust)              | Encrypt data and comply with GDPR                                                                                      |
| User resistance to adoption             | Medium                                                         | Train users, maintain clear documentation, keep instruction easy to understand                                         |

By identifying, assessing, and preparing for these risks, the Scorion development team and our project group can improve the likelihood of a successful outcome. Proactive mitigation strategies ensure that even high-impact risks are managed effectively, minimizing disruptions and maximizing user satisfaction.

---

## Team Plan
