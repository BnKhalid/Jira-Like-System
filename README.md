# **Jira-Like System**

A project management tool inspired by Jira, designed to support agile workflows, task dependencies, and user collaboration across multiple workspaces and projects.

## **Table of Contents**
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## **Features**

- **User Management**: Role-based access control with roles like Leader, Admin and Members.
- **Workspace Management**: Organize tasks and sprints within different workspaces.
- **Task Management**: Task creation, assignment, prioritization and status updates.
- **Task Linking**: Establish task dependencies, subtasks, and other task relationships.
- **Sprint Planning**: Support for agile methodologies with Sprint Tasks.
- **And more...**

## **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/BnKhalid/Jira-Like-System.git
   cd Jira-Like-System
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your environment variables:
   ```plaintext
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_db_user
    DATABASE_NAME=your_database_name

    JWT_ACCESS_TOKEN_EXPIRES_IN=15m
    JWT_REFRESH_TOKEN_EXPIRES_IN=7d

    SALT_ROUNDS=number_of_salt_rounds
   ```

4. **Apply Database Migrations**
   ```bash
   npm run migration:up
   ```

5. **Start the Server**
   ```bash
   npm run start:dev
   ```

   The server will run on `http://localhost:3000` by default.

## **Usage**

1. **API Access**: Use an API client like Postman to interact with the application endpoints.
2. **Role-based Access Control**: Use with different user roles to test access to various endpoints and permissions.

## **Project Structure**

```
src/
├── app.module.ts         # Root module
├── mikro-orm.config.ts   # MikroORM database configuration
├── users/                # User module
├── tasks/                # Task module and realted nested modules
├── workspaces/           # Workspace module and realted nested modules
└── ...
```

## **API Documentation**

### **Authentication**
- `POST /auth/signup`: Register a new user.
- `POST /auth/signin`: Login and receive an access token.
- `POST /auth/refresh`: Refresh an access token using a refresh token.

### **Workspaces**
- `POST /workspaces`: Create a new workspace.
- `GET /workspaces`: List your workspaces.
- `POST /workspaces/:workspaceId/sprints`: Create a new sprint in a workspace.
- ...

### **Tasks**
- `POST /workspaces/:workspaceId/tasks`: Create a new task.
- `GET /workspaces/:workspaceId/tasks`: List workspace tasks with various filters.
- `PATCH /workspaces/:workspaceId/tasks/:id`: Update a task’s details.
- `DELETE /workspaces/:workspaceId/tasks/:id`: Delete a task.
- ...

### **Task Linking and Dependencies**
- `POST /tasks/:id/link`: Link a task to another (e.g., setting dependencies).
- `POST /tasks/:id/label`: Create a task label for modularity.
- ...

## **Testing**

Testing is conducted using Postman. Download the Postman collection and use environment variables to simulate API interactions.

1. **Setting Up Postman**:
   - Configure variables like `baseURL` and `Authorization` token.

2. **Executing Tests**:
   - **CRUD Operations**: Test CRUD for each entity.
   - **Task Linking**: Test linking tasks and setting dependencies.
   - **Error Handling**: Verify responses for invalid requests.