# Code Quality Convention Document

---

## 1. General Code Quality Principles
- **Consistency**: Use consistent naming conventions, indentation, and styling across all files.
- **Readability**: Write clean, readable code. Avoid unnecessary complexity, and favor clarity over brevity.
- **Modularity**: Organize code into functions, components, or modules to avoid duplication and improve reusability.
- **Documentation**: Comment where necessary, especially for complex logic. Every module or function should have a description of its purpose.

---

## 2. Svelte, HTML, and JavaScript Conventions

### 2.1 Svelte and HTML
- **File Naming**: Svelte components should use PascalCase (e.g., `UserProfile.svelte`). HTML files should use lowercase and hyphens (e.g., `index.html`).
- **Component Structure**:
  - Use components for distinct, reusable pieces of the UI.
  - Keep components focused; avoid including unrelated logic.
- **Attributes and Tags**:
  - Use double quotes for attributes.
  - Close all tags properly, even self-closing tags in HTML (`<img />`, `<br />`).
- **Class and ID Naming**: Use `kebab-case` for CSS classes (e.g., `.main-container`).

### 2.2 JavaScript
- **Syntax**:
  - Use **ES6 syntax** (e.g., `const`, `let`, arrow functions).
  - Avoid `var`; prefer `let` for variables that may change and `const` for constants.
- **Naming Conventions**:
  - Use `camelCase` for variables and functions (e.g., `fetchData`, `userName`).
  - Use `PascalCase` for Svelte component names and JavaScript classes.
  - Constants should be in `UPPERCASE_SNAKE_CASE`.
- **Functions**:
  - Keep functions short and focused on a single task.
  - Use arrow functions where appropriate, except for methods in classes.
- **Comments**:
  - Use `//` for single-line comments and `/* ... */` for multi-line comments.
  - Comment on complex or non-obvious logic and include function descriptions.

---

## 3. CSS Conventions
- **Class Naming**: Use `kebab-case` for class names (e.g., `.header-container`).
- **Structure**:
  - Group related CSS properties together (e.g., position-related, typography).
  - Use logical ordering: positioning, box model, typography, visual.
- **Best Practices**:
  - Avoid inline styles; use classes or scoped styles in Svelte components.
  - Minimize the use of IDs in CSS selectors; favor classes for reusability.
  - Follow **BEM (Block Element Modifier)** methodology if applicable for component-based styling.
- **Sass/SCSS (Optional)**: If using a preprocessor like Sass, nest only up to three levels deep to avoid specificity issues.

---

## 4. RESTful API Conventions
- **Endpoint Naming**:
  - Use plural nouns for resource names (e.g., `/api/users` for user data).
  - Use hyphens to separate words in URLs (e.g., `/api/user-profile`).
- **HTTP Methods**:
  - Use appropriate HTTP methods: `GET` for retrieval, `POST` for creation, `PUT/PATCH` for updates, and `DELETE` for deletions.
- **Response Structure**:
  - Return JSON format for all responses.
  - Structure JSON responses consistently, using keys like `data` for main content and `error` for error messages.
- **Error Handling**:
  - Send meaningful HTTP status codes (e.g., `200` for success, `404` for not found, `500` for server error).
  - Provide clear error messages in the response body.

---

## 5. Express.js Conventions
- **File Structure**:
  - Follow an organized folder structure (e.g., `routes/`, `controllers/`, `models/`).
  - Separate concerns: keep route definitions, controller logic, and database interaction in separate files.
- **Naming**:
  - Use `camelCase` for variables and functions.
  - Use `PascalCase` for classes and `UPPERCASE_SNAKE_CASE` for constants.
- **Middleware**:
  - Use middleware functions for reusable logic (e.g., authentication, error handling).
  - Place reusable middleware in a separate `middleware/` directory.
- **Error Handling**:
  - Implement centralized error handling. Use `try-catch` for asynchronous functions.
  - Log errors and provide user-friendly messages to the client.

---

## 6. Database (PostgreSQL or SQLite) Conventions
- **Table Naming**: Use `snake_case` for table names (e.g., `user_profiles`).
- **Column Naming**: Use `snake_case` for columns and be descriptive (e.g., `first_name`, `created_at`).
- **Primary Keys**: Name primary key columns as `id` or `{table_name}_id` (e.g., `user_id`).
- **Foreign Keys**: Use descriptive names and include references (e.g., `profile_id` referencing the `profiles` table).
- **Indexes**: Create indexes on columns that are frequently searched or used in joins to improve performance.
- **Data Consistency**: Use appropriate data types for each column (e.g., `VARCHAR` for text, `INT` for numbers, `BOOLEAN` for true/false values).

---

## 7. Git Workflow and Commit Standards
- **Branching**:
  - Use feature branches for new functionalities (`feature/audio-feedback`).
  - Use `bugfix/` for fixing bugs (`bugfix/fix-audio-bug`).
- **Merge Requests**:
  - All merge requests should be reviewed by another team member before merging.
  - Resolve conflicts in local branches before pushing.
- **Commit Messages**:
  - Write descriptive commit messages in the format: `type(scope): description` (e.g., `feat(audio): add audio feedback recording feature`).
  - Common types: `feat` (feature), `fix` (bug fix), `chore` (miscellaneous tasks), `docs` (documentation), `style` (formatting), `refactor` (code refactoring), `test` (adding tests).
  - Commit often with incremental changes to ensure a clear version history.

---

## 8. Documentation Standards
- **Code Comments**:
  - Comment complex or non-obvious code, especially in backend logic or complex frontend interactions.
  - Use comments to describe the purpose and functionality of functions and classes.
- **README**:
  - Maintain an updated `README.md` in the root directory, describing the project setup, running instructions, and relevant details.
- **API Documentation**:
  - Document all API endpoints with details on request methods, parameters, and response structures.
  - Use Swagger (if applicable) to create API documentation for easy reference.

---