An API made using [Hono](https://hono.dev/) framework to convert speech to text using the [Vosk](https://alphacephei.com/vosk/) model. The API is made using [TypeScript](https://typescriptlang.org/) and [Node.js](https://nodejs.org/en). [SQLite](https://sqlite.org/) is used as the database to store the transcriptions and [Drizzle ORM](https://drizzle.dev/) is used to interact with the database. Additionally, [Zod](https://zod.dev/) is used for data validation and [ESLint](https://eslint.org/) is used for linting.

## Design

The API is designed with user authentication in mind. There are user types and permissions prepared for future use. The API is designed to be scalable and secure.

The main role of this API is to convert speech to text. It accomplishes this by using two main endpoints: `POST` `/audio` and `GET` `/audio/:id`. The first endpoint accepts an audio file and returns a file ID which in practice is its [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash. The file is saved to `/temp/uploads` and added to a queue to be processed by [a worker](https://nodejs.org/api/worker_threads.html). The worker loads a file as a stream and uses the Vosk model to convert the audio file to text. Using streams allows for incremental updates of the transcriptions. The second endpoint accepts the file ID and returns the status of processing and the transcription if it is complete. There are 4 possible statuses: `queued`, `processing`, `completed`, and `failed`. If the file is not found, an appropriate error message is returned.

The API could be improved by persisting the queue and the transcriptions to a database. This would allow for later retrieval of the transcriptions and freeing the queue from memory.

## Setup

- Install the required tools. \
    Follow the instructions in the "[Prerequisites](#prerequisites)" section.
- Clone the repository.
- Open the project in Visual Studio Code.
- Run `npm install` in the terminal to install the required packages. \
    If the installation fails, try removing the `node_modules` folder and running `npm install` again.
- Run `npm run build` in the terminal to build the project.

## Commands

- `npm run build` \
    Build the project.
- `npm run dev` \
    Builds the project and starts the development server.
- `npm run lint` \
    Run ESLint to check for linting errors.
- `npm run lint:fix` \
    Run ESLint to check for linting errors and fix them.

## Prerequisites

- **Visual Studio C/C++** \
    Install "Desktop development with C++" workload using Visual Studio Installer.
    ![image](https://user-images.githubusercontent.com/29135514/151630625-eea0c784-685e-4e8f-aa67-c47aef7f0d80.png)
- **Install Node 22 LTS** \
    Download and install Node.js from the official website: https://nodejs.org/en/. \
    Remember to check the box "Automatically install the necessary tools..." during the installation.
    ![image](https://i.sstatic.net/VReOQ.png)
- **Download Vosk model** \
    Download the Vosk model from the official website: https://alphacephei.com/vosk/models. \
    Extract the model to the `src/models` folder in the project directory and set the path in the `src/utils/worker.ts` file.