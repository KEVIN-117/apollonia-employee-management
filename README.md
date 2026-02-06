# Apollonia Employee Management System

This project is a basic Employee Management CRUD web application developed for **Apollonia Dental Practice**.  
It is designed as the foundation for a future employee and customer relationship management system.

The application allows managing **employees** and **departments**, performing full CRUD operations through a REST API and a simple web interface.

---

## 🏗️ Project Overview

Apollonia Dental Practice is beginning the digitalization of its employee management process.  
At this stage, the main goal is to store and manage:

- Clinic departments
- Employees assigned to departments

This project serves as an initial step toward a larger system that may later include:

- Patients
- Projects
- Trainings and specializations
- Revenue tracking

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

### Frontend

- HTML
- CSS
- JavaScript (Vanilla)

### Infrastructure

- Docker
- Docker Compose

---

## 📐 System Architecture

```
Browser (HTML/CSS/JS)
|
v
REST API (Node.js + Express)
|
v
MongoDB

```

The application follows a modular and scalable architecture, separating concerns between:

- Models
- Controllers
- Routes
- Configuration

---

## 🗄️ Data Models

### Department

- name

### Employee

- firstName
- lastName
- department (reference to Department)

---

## 🔌 API Endpoints

### Departments

- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/:id`
- `DELETE /api/departments/:id`

### Employees

- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

---

## 🐳 Running the Project with Docker

### Prerequisites

- Docker
- Docker Compose

### Steps

```bash
docker-compose up --build
````

The API will be available at:

```
http://localhost:3000
```

MongoDB will run in a separate container with persistent storage.

---

## 📂 Project Structure

```
backend/
 ├── src/
 │   ├── config/
 │   ├── models/
 │   ├── controllers/
 │   ├── routes/
 │   ├── app.js
 │   └── server.js
 ├── Dockerfile
 ├── package.json
 └── .env
```

---

## 🚀 Future Improvements

- Authentication and authorization
- Patient management
- Project and task assignment
- Employee performance tracking
- Revenue reporting

---

## 👤 Author

Developed as a practice project for learning full-stack development with Node.js and MongoDB.
