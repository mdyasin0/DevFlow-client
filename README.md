# Team Collaboration SaaS Platform 

## Overview

This is the frontend of a full stack team collaboration and project management platform. The application allows users to manage projects, assign tasks, collaborate with team members, and track performance in a structured way.

The system is designed based on real-world tools like Jira, Trello, and Asana, focusing on usability, workflow clarity, and real-time interaction.

## Key Features

* Authentication system with email/password and Google login
* Role-based UI (User, Manager, Admin)
* Project creation and management
* Task management with status flow (Todo, Running, Done)
* Real-time notifications
* Project-based discussion system
* Performance analytics with charts
* Invitation and team management system
* Advanced search and filtering
* File upload support (premium users)
* SaaS plan-based feature control

## Tech Stack

* React.js
* Vite
* Tailwind CSS
* DaisyUI
* React Router
* Context API
* Axios
* Socket.io Client
* Firebase Authentication
* Framer Motion
* React Icons
* React Quill
* Recharts
* SweetAlert2

## Application Structure

The frontend is organized into reusable components and feature-based modules:

* Authentication (Login, Register)
* Dashboard (Role-based views)
* Project Management
* Task Management
* Team Management
* Notification System
* Analytics
* Discussion System

## State Management

Global state is managed using Context API. API data is fetched using Axios ,Fetch and synchronized with backend services.

## Real-time Communication

Socket.io client is used to receive instant updates such as notifications and task changes without refreshing the UI.

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   npm install
3. Create a .env file and configure:
  VITE_apiKey= 
  VITE_authDomain= 
  VITE_projectId= 
  VITE_storageBucket= 
  VITE_messagingSenderId=
  VITE_appId= 
1. Run the development server:
   npm run dev

## Build

To create a production build:
npm run build

## Notes

* Make sure the backend server is running before starting the frontend
* Environment variables must be properly configured
* Some features are restricted based on user subscription plan

## Purpose

This project demonstrates the ability to build a scalable, role-based, real-time frontend application with modern UI/UX practices and structured state management.
