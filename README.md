# LearnUp Backend

This repository contains the backend for the LearnUp e-learning platform. The backend is built with Node.js and Express, providing a robust API to support functionalities like user authentication, course management, and payment integration.

## Features

- **Authentication**: Secure user login, registration, and password reset with JSON Web Tokens (JWT).
- **Role-Based Access**: Support for students, instructors, and admin roles.
- **Course Management**: Create, update, publish, and delete courses with lessons.
- **Payment Integration**: Stripe-based payments for course enrollment.
- **Statistics**: Revenue tracking and enrolled student statistics for instructors.
- **Protected Routes**: JWT and CSRF protection for secure API access.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for creating APIs.
- **MongoDB**: Database for storing user and course information.
- **Stripe**: Payment processing.
- **JWT**: Authentication and session management.
- **Cloudinary**: For file uploads like course videos and images.
- **SendGrid**: Email service for notifications and password reset links.

---

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/Aymenkenway/LearnUp-Backend
   cd LearnUp-Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```env
   DATABASE_URL=<Your MongoDB connection string>
   JWT_SECRET=<Your JWT secret key>
   STRIPE_SECRET_KEY=<Your Stripe secret key>
   SENDGRID_API_KEY=<Your SendGrid API key>
   AWS_ACCESS_KEY_ID=<Your AWS access key>
   AWS_SECRET_ACCESS_KEY=<Your AWS secret key>
   AWS_BUCKET_NAME=<Your S3 bucket name>
   ```

4. Start the development server:
   ```bash
   npm start
   ```

---

## API Endpoints

### **Authentication Routes**

- `POST /api/register`: Register a new user.
- `POST /api/login`: Login user and return a token.
- `GET /api/logout`: Logout the user.
- `POST /api/forgot-password`: Send a password reset link.
- `POST /api/reset-password`: Reset user password.

### **Course Routes**

- `POST /api/course`: Create a new course (Instructor only).
- `PUT /api/course/:slug`: Update a course (Instructor only).
- `PUT /api/course/publish/:courseId`: Publish a course.
- `PUT /api/course/unpublish/:courseId`: Unpublish a course.
- `POST /api/course/lesson/:slug/:instructorId`: Add a lesson to a course.
- `PUT /api/course/lesson/:slug/:instructorId`: Update a lesson.
- `GET /api/courses`: Get a list of all courses.
- `GET /api/course/:slug`: View course details.

### **Payment Routes**

- `POST /api/free-enrollment/:courseId`: Enroll in a free course.
- `POST /api/paid-enrollment/:courseId`: Enroll in a paid course.
- `GET /api/stripe-success/:courseId`: Stripe payment success callback.

### **Instructor Routes**

- `POST /api/make-instructor`: Register as an instructor.
- `GET /api/current-instructor`: Verify instructor role.
- `GET /api/instructor-courses`: View instructor-created courses.
- `POST /api/instructor/student-count`: Get enrolled student count.

---

## Project Structure

```
learnup-backend/
├── controllers/     # Logic for handling API requests
├── middlewares/     # Custom middleware for authentication
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── utils/           # Utility functions
├── server.js        # Main entry point of the application
└── .env             # Environment variables
```

---

## Challenges Faced

1. **Stripe Integration**: Configuring webhooks and handling secure payments required in-depth understanding.
2. **Role-Based Access**: Implementing middleware for various user roles was challenging but rewarding.
3. **Video Uploads**: Handling large video uploads securely to AWS S3 required fine-tuning.

---
