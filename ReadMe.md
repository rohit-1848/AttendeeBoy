# AttendeeBoy - Secure Online Voter Attendance System

## Overview

**AttendeeBoy** is a secure, privacy-preserving online attendance marking system designed for voter attendance during polling days. This project addresses the limitations of manual attendance tracking using Google Sheets by ensuring voter data confidentiality and restricting access to authorized personnel only. Built with React and integrated with a backend API, AttendeeBoy provides a user-friendly interface for volunteers (Election Officers) and admins, with a focus on mobile compatibility for enhanced accessibility.

This system was developed as a solution to the problem statement outlined in the assignment: to replace insecure manual methods with a secure, efficient, and privacy-focused digital solution for voter attendance management.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Security Considerations](#security-considerations)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Future Advancements](#future-advancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### Current Features
- **Minimal Input Attendance Marking**:
  - Volunteers enter a roll number (voter ID) to view the associated name.
  - Attendance is marked with a single confirmation, resetting the screen afterward.
- **Privacy-Focused UI**:
  - Displays only the current voter's name, ensuring no other data is exposed.
  - Screen resets after each attendance mark for the next voter.
- **Admin Panel**:
  - Secure login system for admins.
  - Admins can upload a master voter list (CSV format) before polling day.
  - View the complete list of voters marked present.
- **Access Control**:
  - Authentication for volunteers (Election Officers) to mark attendance.
  - Admin-only access to the full attendance list.
- **Platform Accessibility**:
  - Optimized for mobile devices (responsive design for screens below 768px).
- **Optional Extensions**:
  - Export attendance data as a CSV file.
  - Timestamps included with attendance entries.

### Security Features
- Voter data is secured using HTTP-only cookies and backend authentication.
- No sensitive data is cached or exposed unintentionally.
- Attendance data is stored securely via a database (connected to the backend API).

## Installation

### Prerequisites
- Node.js (v14.x or later)
- npm (v6.x or later)
- Backend API running on `http://localhost:8000` (assumed to be provided separately)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/attendeeboy.git
   cd attendeeboy
2. Install Dependencies:
    npm install for frontend 
    requirements file for backend
    set the envornment for .env file
3. Configure Environment:
    Ensure the backend API is running on http://localhost:8000.
    Update the API endpoints in the code (e.g., fetch calls) if the backend URL differs.
4. Start the Application:
    In terminal 1.
    cd backend
    uvicorn main:app --reload
    IN terminal 2.
    cd frontend
    npm i
    npm run dev
## Usage
1. Login:
    Navigate to http://localhost:3000.
    Log in with admin or volunteer credentials provided by the system administrator.
2. Volunteer Workflow:
    Enter a roll number in the volunteer dashboard.
    Confirm the displayed name and mark attendance.
    The screen resets automatically for the next voter.
3. Admin Workflow:
    Log in as an admin.
    Upload the master voter list (CSV) via the admin dashboard.
    View or export the attendance list with timestamps.
4. Mobile Access:
    Access the site on a mobile device or use browser dev tools to simulate mobile screens (e.g., 320px, 375px).
    All pages are responsive and optimized for touch interactions.


## Security Considerations
    Data Privacy: Voter names and roll numbers are only displayed for the current entry, with no public exposure.
    Authentication: Uses JWT tokens and HTTP-only cookies for secure session management.
    Data Storage: Attendance data is saved in a backend database, not exposed via sheets.
    No Caching: Client-side caching is minimized to prevent data leakage.

## Technologies Used
    Frontend: React.js, Framer Motion (for animations)
    Styling: CSS (custom with media queries for responsiveness)
    Icons: React Icons
    Routing: React Router DOM
    Backend: Assumed Node.js/Express API (not included, running on http://localhost:8000)
    Authentication: JWT with cookie-based sessions

## File Structure

    attendeeboy/
    │
    ├── public/              # Static files (e.g., logo.png)
    │   └── index.html
    │
    ├── src/
    │   ├── components/      # Reusable components
    │   │   └── Public/
    │   │       ├── Navbar.jsx
    │   │       └── ProtectedRoute.jsx
    │   │
    │   ├── pages/           # Page components
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Home.jsx
    │   │   └── Profile.jsx
    │   │
    │   ├── css/             # Stylesheets
    │   │   ├── Login.css
    │   │   ├── Navbar.css
    │   │   ├── Profile.css
    │   │   └── Home.css
    │   │
    │   ├── App.jsx          # Main app component
    │   ├── App.css          # Global styles
    │   └── index.js         # Entry point
    │
    ├── package.json         # Project dependencies and scripts
    └── README.md            # This file

## Future Advancements
The AttendeeBoy project is a work in progress with plans for significant enhancements to meet additional requirements and improve functionality. Below        are theproposed future advancements:

1.    Fully Functional Profile Page:
    Objective: Enhance the profile page to display detailed user information (e.g., attendance history, role-specific stats) and allow updates (e.g., name, contact info).
    Implementation: Integrate API endpoints (/api/profile/update) to enable CRUD operations. Add form inputs for editing and validation for mobile usability.
    Benefits: Provides users with a personalized dashboard and improves user engagement.
2.    Reset Password Implemented:
    Objective: Fully implement the reset password flow, including token-based verification via email.
    Implementation: Complete the ResetPassword.jsx page with proper token handling from the URL query parameter. Ensure the backend API (/api/auth/reset-password) supports token validation and password updates.
    Benefits: Enhances security and user convenience for password recovery.
3.    Admin Attendance Marking:
    Objective: Allow admins to mark attendance directly, in addition to volunteers.
    Implementation: Add a "Mark Attendance" button in the admin dashboard (Home.jsx) with an API endpoint (/api/home/mark-attendance-admin). Include validation to prevent duplicate entries and update the attendance list dynamically.
    Benefits: Increases flexibility and reduces dependency on volunteers during polling.

## Additional Enhancements
Real-Time Updates: Implement WebSocket or polling to refresh attendance data in real-time for admins.
Multi-Language Support: Add localization for accessibility in diverse regions.
Offline Mode: Develop a Progressive Web App (PWA) feature to allow attendance marking in areas with poor internet connectivity, syncing data when online.
Advanced Analytics: Provide admins with attendance trends and reports (e.g., turnout percentage) via charts.

## Contributing
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -m "Add feature").
Push to the branch (git push origin feature-branch).
Open a pull request with a description of your changes.
## License
This project is self project.

## Contact
Author: Rohit
Email: []
GitHub: https://github.com/rohit-1848

## some buges to be resolved
JWT token remains stored in cookies even after log out and get erased at refresh only. This allows access og home page directly by "/home" endpoint.
