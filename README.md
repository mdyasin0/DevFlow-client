# Team Collaboration SaaS Platform — Client

## Overview

The frontend of a full-stack Team Collaboration and Project Management SaaS Platform built to help teams organize projects, manage tasks, collaborate with members, and monitor work progress through a centralized dashboard.

The application provides role-based interfaces for Users, Managers, and Admins, with interactive project workflows, real-time updates, team collaboration tools, and subscription-based feature access.

## Key Features

### Authentication & User Experience
- Email and password login and registration.
- Google authentication.
- Role-based user interfaces for Users, Managers, and Admins.
- Protected routes and role-specific dashboard views.

### Project & Task Management
- Create and manage projects.
- Project approval workflow interfaces.
- Assign and manage tasks.
- Track task progress through Todo, Running, and Done statuses.
- Search and filter projects and tasks.

### Team Collaboration
- Team invitation and member management interfaces.
- Project-based discussion system.
- Real-time notifications and task updates.
- Interactive collaboration workflows.

### Dashboard & Analytics
- Role-based dashboards.
- Performance analytics with interactive charts.
- Data visualization using Recharts.
- Organized views for monitoring project and task progress.

### Subscription-Based Features
- Subscription-aware feature access.
- Premium file upload interface.
- UI-level feature restrictions based on user subscription plans.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- DaisyUI

### Routing & State Management
- React Router
- Context API

### API Communication
- Axios
- Native Fetch API

### Authentication
- Firebase Authentication

### Real-Time Communication
- Socket.io Client

### UI & Animation
- Framer Motion
- React Icons
- SweetAlert2

### Rich Text Editing
- React Quill

### Data Visualization
- Recharts

## Application Structure

The frontend is organized into reusable components and feature-based modules:

- **Authentication:** Login, registration, and authentication interfaces.
- **Dashboard:** Role-based dashboards for different user types.
- **Project Management:** Project creation, management, and approval interfaces.
- **Task Management:** Task assignment, status updates, and progress tracking.
- **Team Management:** Member management and invitation interfaces.
- **Notifications:** Real-time notification interfaces.
- **Analytics:** Performance dashboards and interactive charts.
- **Discussion:** Project-based discussion interfaces.
- **Admin Dashboard:** Administrative interfaces for managing users, projects, and email-related workflows.

## State Management & API Integration

Context API is used to manage shared application state across components.

Axios and the native Fetch API are used for communicating with backend services and retrieving application data.

The frontend integrates with the backend API to support authentication, project workflows, task management, team collaboration, and other application features.

## Real-Time Communication

Socket.io Client is used to establish real-time communication with the backend.

It allows the interface to receive updates such as notifications and task changes without requiring a manual page refresh.

## Installation & Setup

### Prerequisites
- Node.js
- npm
- Access to the backend API
- Firebase project configuration

### 1. Clone the repository

```bash
git clone https://github.com/mdyasin0/DevFlow-client.git
cd YOUR_CLIENT_REPOSITORY_FOLDER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your Firebase configuration:

```env
VITE_apiKey=YOUR_FIREBASE_API_KEY
VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
VITE_projectId=YOUR_FIREBASE_PROJECT_ID
VITE_storageBucket=YOUR_FIREBASE_STORAGE_BUCKET
VITE_messagingSenderId=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_appId=YOUR_FIREBASE_APP_ID
```

Also configure the backend API URL using the actual environment variable name expected by your client code.

**Note:** Use your actual environment variable names. Do not commit real credentials or secret values to the repository.

### 4. Start the development server

```bash
npm run dev
```

### 5. Create a production build

```bash
npm run build
```

## Important Notes

- The backend server must be running and accessible for API-dependent features.
- Firebase environment variables must be configured correctly.
- Some interface features are available according to the user's subscription plan.
- Backend-dependent functionality requires a working connection to the server.

## Project Purpose

This project demonstrates practical frontend development skills through a feature-rich SaaS application, including component-based architecture, role-based interfaces, API integration, state management, real-time communication, and interactive data visualization.
