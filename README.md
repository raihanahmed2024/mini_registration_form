# Mini Registration Form

A full-stack registration application with a React frontend and ASP.NET Core backend using MongoDB.

## Features

- ✅ User registration form with validation
- ✅ MongoDB database integration
- ✅ REST API with CORS enabled
- ✅ Real-time data display
- ✅ Professional UI with gradient design
- ✅ Form validation (date of birth, email, etc.)
- ✅ Responsive design

## Tech Stack

### Backend
- ASP.NET Core (.NET 10)
- MongoDB
- Swagger/OpenAPI documentation

### Frontend
- React 18
- Vite
- Axios
- CSS3

## Project Structure

```
mini_registration_form/
├── backend/
│   └── RegistrationApi/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       ├── Settings/
│       ├── DTOs/
│       ├── Program.cs
│       ├── appsettings.json
│       └── RegistrationApi.csproj
├── frontend/
│   └── registration-ui/
│       ├── src/
│       │   ├── components/
│       │   ├── api.js
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── package.json
│       ├── vite.config.js
│       └── .env
└── README.md
```

## Prerequisites

- .NET 10 SDK
- Node.js 18+
- MongoDB 5.0+
- Git

## Installation

### Backend Setup

```bash
cd backend/RegistrationApi
dotnet restore
```

### Frontend Setup

```bash
cd frontend/registration-ui
npm install
```

## Configuration

### Backend (appsettings.json)
```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "MiniRegistrationDb",
    "CollectionName": "registrations"
  }
}
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5128/api
```

## Running the Application

### Start MongoDB
```bash
mongod
```

### Start Backend API
```bash
cd backend/RegistrationApi
dotnet run
```
Backend will be available at `http://localhost:5128`

### Start Frontend Dev Server
```bash
cd frontend/registration-ui
npm run dev
```
Frontend will be available at `http://localhost:5174`

## API Endpoints

- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create a new registration


## Author

Raihan Ahmed
