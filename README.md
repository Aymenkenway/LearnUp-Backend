````markdown
# LearnUp Backend

Welcome to the backend repository of **LearnUp**, the server-side application that powers the e-learning platform.

## 🌟 Features

- **User Authentication**: JWT-based secure login and registration.
- **Course Management**: APIs for creating, updating, and managing courses.
- **Payment Processing**: Integrated with Stripe and PayPal.
- **File Uploads**:Cloudinary support for media uploads.
- **Email Notifications**: SendGrid for transactional emails.
- **Secure and Scalable**: CSRF protection, cookie parsing, and MongoDB Atlas integration.

## 🛠️ Technologies Used

- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payments**: Stripe, PayPal
- **Utilities**: bcrypt, slugify, nanoid
- **Email Service**: SendGrid

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB Atlas account
- API keys for Stripe, Cloudinary, and SendGrid

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aymenkenway/LearnUp-Backend
   ```
````

2. Navigate to the project folder:
   ```bash
   cd learnup-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables in `.env`:
   ```plaintext
   PORT=<server-port>
   MONGO_URI=<mongodb-connection-string>
   JWT_SECRET=<jwt-secret-key>
   CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<cloudinary-api-key>
   CLOUDINARY_API_SECRET=<cloudinary-api-secret>
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   SENDGRID_API_KEY=<sendgrid-api-key>
   ```
5. Start the server:
   ```bash
   npm start
   ```

## 📂 Folder Structure

- `/controllers`: Core business logic for features.
- `/models`: MongoDB schemas for users, courses, and lessons.
- `/routes`: REST API routes for various modules.
- `/middleware`: Authentication and error handling middleware.

## 📊 API Documentation

| Endpoint                   | Method | Description                      |
| -------------------------- | ------ | -------------------------------- |
| `/api/auth/register`       | POST   | Register a new user              |
| `/api/auth/login`          | POST   | Authenticate a user              |
| `/api/courses`             | GET    | Get a list of all courses        |
| `/api/courses`             | POST   | Create a new course (instructor) |
| `/api/courses/:id`         | PUT    | Update a course                  |
| `/api/courses/:id`         | DELETE | Delete a course                  |
| `/api/courses/:id/lessons` | POST   | Add a lesson to a course         |

## 📦 Deployment

Deploy the backend on [Render](https://render.com/) or [Heroku](https://www.heroku.com/):

1. Push the repository to your GitHub account.
2. Connect the repository on the deployment platform.
3. Add required environment variables.
4. Deploy and test your APIs.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```

```
