# Rex School Management System

Advanced AI-automated school management system for all levels of education.

## Overview

Rex School Management System is a comprehensive solution designed to streamline school administration, enhance communication between teachers, students, and parents, and provide powerful tools for academic management.

## Features

- **User Management**: Role-based access control for administrators, teachers, students, and parents
- **Student Management**: Complete student profiles, academic records, and attendance tracking
- **Teacher Management**: Teacher profiles, class assignments, and performance evaluation
- **Academic Management**: Curriculum planning, class scheduling, and resource allocation
- **Examination System**: Exam creation, grading, and result analysis
- **Attendance Tracking**: Digital attendance management for students and staff
- **Communication Tools**: Messaging system, announcements, and notifications
- **Reports & Analytics**: Comprehensive reporting and data visualization
- **Mobile Responsive**: Access from any device with a responsive design

## Technology Stack

### Backend

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport
- **API Documentation**: Swagger
- **Testing**: Jest

### Frontend

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React Query, Context API
- **Authentication**: NextAuth.js
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rextech368/Rex-School-Management-System.git
   cd Rex-School-Management-System
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both the backend and frontend directories based on the provided examples

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run start:dev

   # Start frontend server
   cd ../frontend
   npm run dev
   ```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   ├── users/
│   │   ├── students/
│   │   ├── academics/
│   │   ├── exams/
│   │   └── common/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   └── next.config.js
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeORM](https://typeorm.io/)

