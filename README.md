# Rex-School-Management-System

Advanced AI automated school management system for all levels of education.

## Overview

Rex School Management System is a comprehensive platform designed to streamline educational institution management. It provides tools for managing students, staff, academics, finances, and communications.

## Features

- **Multi-tenant Architecture**: Support for multiple schools or branches
- **Role-Based Access Control**: Different access levels for administrators, teachers, students, and parents
- **Student Management**: Registration, profiles, attendance, and performance tracking
- **Staff Management**: HR, attendance, and performance evaluation
- **Academic Management**: Classes, subjects, timetables, and examinations
- **Financial Management**: Fees, payments, expenses, and payroll
- **Communication**: Email and SMS notifications
- **Reporting**: Customizable reports and analytics
- **File Management**: Secure storage and sharing of documents

## Tech Stack

### Backend
- NestJS (Node.js framework)
- TypeORM for database interactions
- PostgreSQL database
- Redis for caching and queues
- JWT for authentication

### Frontend
- Next.js (React framework)
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for data fetching

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Redis

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
   ```bash
   # Copy the example env file
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

4. Run database migrations:
   ```bash
   cd backend
   npm run migration:run
   ```

5. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run start:dev

   # Start frontend server
   cd ../frontend
   npm run dev
   ```

6. Access the application:
   - Backend API: http://localhost:3000/api/v1
   - Frontend: http://localhost:3001

## Documentation

For detailed documentation, please refer to the [Wiki](https://github.com/rextech368/Rex-School-Management-System/wiki).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

