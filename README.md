# Task Manager API

A simple task manager REST API with user authentication using Node.js, Express, MySQL, and JWT.
The API supports user authentication and allows each user to perform CRUD operations on their own tasks.

# Features

1. User registration and login using JWT authentication.
2. CRUD operations to perform tasks(Create, Read, update and delete)
3. Bcrypt usage for hashed/secure password storage
4. Pagination and status filtering(bonus)

## Technologies Used

1. Node.js and Express.js for the backend server.
2. MySQL for the database.
3. JWT for authentication.
4. bcrypt for password hashing.
5. express-validator for input validation before processing requests.

## Prerequisites

- [Node.js](https://nodejs.org/)
- MySQL Database

## Setup

1. Clone the repository:
   git clone https://github.com/kmohit9111/task-manager-assessment
   cd task-manager-assessment

2. Install dependencies:
   npm install

3. Create .env file in root directory and assigne following environment variables:
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=task_manager
   JWT_SECRET=your_jwt_secret

4. Login to mySQL and Create a MySQL database named `task_manager` and run(database name should match the one in environment variables):

   ```bash
   mysql -u root -p
   ```

   ```sql
    CREATE DATABASE task_manager;
   ```

5. Create tables users and tasks:

   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) UNIQUE,
     password VARCHAR(255)
   );
   CREATE TABLE tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
     dueDate DATE NOT NULL,
     userId INT,
     FOREIGN KEY (userId) REFERENCES users(id)
   );
   ```

6. Run the server:
   ```
   npm start
   ```

## API Endpoints

AUTHENTICATION

- POST `/api/auth/register`
  Register a new API
  Body:
  {
  "name": "Mohit",
  "email": "mohit@example.com",
  "password": "123456"
  }

  Response:
  {
  "message": "User registered successfully"
  }

- POST `/api/auth/login`
  Log in a user and get a JWT token.
  Body:
  {
  "email": "mohit@example.com",
  "password": "123456"
  }

  Response:
  {
  "token": "your_token_received"
  }

- Add Authorization Header
  Key: Authorization
  Value: Bearer <your_token_here_which_you_received_by_logging_in>
  Now you are authenticated to access task routes

TASK MANAGEMENT

- GET `/api/tasks`
  Fetch all tasks for the logged-in user, with optional filtering by status and pagination.
  Query Parameters:
  status (optional): Filter tasks by pending, in-progress, or completed.
  page (optional, default 1): Page number for pagination.
  limit (optional, default 10): Number of tasks per page.

  Response:
  {
  "page": 1,
  "limit": 10,
  "tasks": [
  {
  "id": 1,
  "title": "Complete the task manager project sss",
  "description": "Implement CRUD",
  "status": "pending",
  "dueDate": "2025-04-15T18:30:00.000Z",
  "userId": 2,
  "created_at": "2025-04-15T13:44:25.000Z"
  }
  ]
  }

- POST `/api/tasks`
  Create a task
  Body:
  {
  "title": "Complete the task manager project sss",
  "description": "Implement CRUD",
  "status": "pending",
  "dueDate": "2025-04-16"
  }

  Response:
  {
  "message": "Task created successfully",
  "taskId": 2
  }

- PUT `/api/tasks/:id`
  Update existing tasks which(logged in user can only update their own task)
  Body:
  {
  "title": "Complete the task manager project updated",
  "description": "Implement CRUD operations",
  "status": "pending",
  "dueDate": "2025-04-16"
  }

  Response:
  {
  "message": "Task updated successfully"
  }

- DELETE `/api/tasks/:id`
  Delete existing task(logged in user can only delete their own task)
  Response:
  {
  "message": "Task deleted successfully"
  }

All `/api/tasks` routes require JWT authentication.

## Postman Collection

You can import the Postman collection manually from the `postman/Task Manager.postman_collection.json` file in this repository.
To import

1. Go to Postman
2. In File, Click import
3. Upload the above JSON file
