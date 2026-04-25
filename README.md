# Complaint Management System

A comprehensive backend system for managing college complaints with MongoDB Atlas integration, built with Node.js, Express.js, and clean architecture principles.

## Features

- **User Management**: Registration, authentication, role-based access (Student/Admin/Department)
- **Complaint Management**: Create, view, update, and delete complaints
- **File Upload Support**: Image and video uploads for complaint evidence
- **Pagination & Search**: Advanced search and filtering capabilities
- **Security**: JWT authentication, rate limiting, input validation
- **Clean Architecture**: Separation of concerns with Controllers, Services, and Models

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi for input validation
- **File Upload**: Multer for image/video handling
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv for configuration management

## Project Structure

```
College-Complaint-Management-System/
|
|-- src/
|   |-- config/
|   |   |-- db.js                 # Database connection
|   |-- controllers/
|   |   |-- userController.js     # User-related operations
|   |   |-- complaintController.js # Complaint-related operations
|   |-- middleware/
|   |   |-- auth.js               # JWT authentication
|   |   |-- admin.js              # Admin role verification
|   |   |-- department.js         # Department role verification
|   |   |-- upload.js             # File upload handling
|   |   |-- complaintValidation.js # Input validation
|   |   |-- logger.js             # Request logging
|   |   |-- errorHandler.js       # Global error handling
|   |-- models/
|   |   |-- User.js               # User schema
|   |   |-- Complaint.js          # Complaint schema
|   |-- routes/
|   |   |-- userRoutes.js         # User endpoints
|   |   |-- complaintRoutes.js    # Complaint endpoints
|   |-- services/
|   |   |-- userService.js        # User business logic
|   |   |-- complaintService.js   # Complaint business logic
|   |-- app.js                    # Main application file
|   |-- utils/                    # Utility functions
|
|-- uploads/                      # File upload directory
|-- .env                         # Environment variables
|-- package.json
|-- README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd Complaint-Management-System

# Install dependencies
npm install

# Install development dependencies
npm install -D nodemon
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/complaint_management?retryWrites=true&w=majority

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### Complaint Endpoints

#### Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "Infrastructure Issue"
description: "Detailed description of the complaint..."
category: "Infrastructure"
department: "Facilities"
media: [file]
```

#### Get All Complaints (with pagination and search)
```http
GET /api/complaints?page=1&limit=10&status=pending&department=Facilities&search=infrastructure
Authorization: Bearer <token>
```

#### Get Complaint by ID
```http
GET /api/complaints/:complaintId
Authorization: Bearer <token>
```

#### Update Complaint
```http
PUT /api/complaints/:complaintId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Updated Category"
}
```

#### Delete Complaint
```http
DELETE /api/complaints/:complaintId
Authorization: Bearer <token>
```

#### Get My Complaints (for logged-in student)
```http
GET /api/complaints/my-complaints?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

#### Update Complaint Status (Admin/Department only)
```http
PATCH /api/complaints/:complaintId/status
Authorization: Bearer <admin_or_department_token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/users/all?page=1&limit=10&role=student
Authorization: Bearer <admin_token>
```

#### Get User Statistics
```http
GET /api/users/stats
Authorization: Bearer <admin_token>
```

#### Get Complaint Statistics
```http
GET /api/complaints/stats
Authorization: Bearer <admin_token>
```

#### Delete User
```http
DELETE /api/users/:userId
Authorization: Bearer <admin_token>
```

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Filtering
- `status`: Filter by status (pending, in-progress, resolved)
- `department`: Filter by department
- `category`: Filter by category

### Search
- `search`: Search in title and description (regex/partial match)

### Sorting
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort order (asc/desc, default: desc)

## Database Schema

### User Schema
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, 6+ chars, hashed),
  role: String (enum: ['student', 'admin', 'department'], default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Schema
```javascript
{
  title: String (required, 5-100 chars),
  description: String (required, 20-1000 chars),
  category: String (required, 2-50 chars),
  media: String (optional, file path),
  status: String (enum: ['pending', 'in-progress', 'resolved'], default: 'pending'),
  studentId: ObjectId (ref: 'User', required),
  department: String (required, 2-50 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```

### Common Error Codes

- `400`: Bad Request (Validation errors, invalid data)
- `401`: Unauthorized (Invalid/missing token)
- `403`: Forbidden (Insufficient permissions)
- `404`: Not Found (Resource doesn't exist)
- `500`: Internal Server Error

## Testing with Postman

### Setup

1. Import the Postman collection (if provided) or create requests manually
2. Set environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: Store JWT token after login

### Sample Workflow

1. **Register a student user**
2. **Login to get JWT token**
3. **Create a complaint with media file**
4. **Get all complaints with pagination**
5. **Update complaint status (as admin/department)**
6. **Search complaints by title**

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi validation for all inputs
- **File Upload Security**: File type and size restrictions
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet.js**: Security headers

## Common Issues and Solutions

### 1. MongoDB Connection Error
- Ensure MONGO_URI is correct in `.env`
- Check network connectivity
- Verify MongoDB Atlas IP whitelist

### 2. JWT Token Issues
- Ensure JWT_SECRET is set in `.env`
- Check token expiration
- Verify token format in Authorization header

### 3. File Upload Issues
- Ensure uploads directory exists
- Check file size limits (max 10MB)
- Verify file is an image or video type

### 4. Validation Errors
- Check required fields
- Verify field lengths and formats
- Ensure enum values are correct

## Development Tips

- Use `npm run dev` for development with auto-restart
- Check console logs for detailed error information
- Use MongoDB Compass to visualize database
- Test endpoints sequentially (register -> login -> create complaint)

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use strong JWT_SECRET
3. Configure proper CORS origin
4. Set up proper MongoDB Atlas security
5. Use process manager like PM2
6. Implement proper logging

## Bonus Features Implemented

- **Pagination**: Built into all list endpoints
- **Search**: Regex-based search in title and description
- **File Upload**: Support for images and videos
- **Role-based Access**: Student, Admin, and Department roles
- **Statistics**: User and complaint statistics endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
