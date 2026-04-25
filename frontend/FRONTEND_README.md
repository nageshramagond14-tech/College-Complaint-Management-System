# Complaint Management System - Frontend

A modern React frontend built with Vite and Tailwind CSS for the Complaint Management System.

## Tech Stack

- **React 18** - UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar with responsive menu
│   │   ├── Button.jsx       # Reusable button with variants
│   │   ├── StatusBadge.jsx  # Status indicator component
│   │   ├── ComplaintCard.jsx # Card layout for complaints
│   │   └── ComplaintTable.jsx # Table layout for complaints
│   ├── pages/               # Page-level components
│   │   ├── Landing.jsx      # Hero page with features
│   │   ├── Dashboard.jsx    # Complaint list with filters
│   │   ├── AddComplaint.jsx # Form to submit complaints
│   │   └── ComplaintDetails.jsx # Individual complaint view
│   ├── hooks/               # Custom React hooks
│   │   └── useComplaints.js # Complaint state management
│   ├── services/            # API service layer (mock)
│   │   └── complaintService.js # Simulated API calls
│   ├── data/                # Mock data
│   │   └── dummyData.js     # Sample complaints
│   ├── App.jsx              # Root component with routing
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies
```

## React Concepts Used

### 1. useState - State Management
Used throughout components to manage local state:
- Form inputs in AddComplaint
- View mode toggle in Dashboard
- Mobile menu state in Navbar
- Loading and error states

```jsx
const [complaints, setComplaints] = useState([]);
const [loading, setLoading] = useState(false);
```

### 2. useEffect - Side Effects
Used for data fetching and component lifecycle:
- Fetch complaints on dashboard mount
- Load complaint details when ID changes
- Simulate API delays

```jsx
useEffect(() => {
  fetchComplaints();
}, [fetchComplaints]);
```

### 3. Virtual DOM
React creates a virtual representation of the DOM in memory. When state changes:
1. React builds new virtual DOM tree
2. Compares with previous tree (diffing)
3. Calculates minimal updates needed
4. Applies only necessary changes to real DOM

This makes our app fast and efficient, especially with dynamic lists.

### 4. Closures in Event Handlers
Functions that capture their surrounding scope:

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,  // Closure captures 'name'
  }));
};
```

### 5. Props and Reusability
Components receive data through props:

```jsx
// StatusBadge component
const StatusBadge = ({ status }) => {
  // Renders different colors based on status prop
};

// Used in multiple places
<StatusBadge status="pending" />
<StatusBadge status="resolved" />
```

## Component Architecture

### Why This Structure?

1. **Components/** - Reusable building blocks
   - **Navbar**: Shared across all pages
   - **Button**: Consistent styling, multiple variants
   - **StatusBadge**: Centralized status display
   - **ComplaintCard/Table**: Different views of same data

2. **Pages/** - Route-level components
   - Each page is a distinct view
   - Can combine multiple components
   - Handle page-specific logic

3. **Hooks/** - Shared logic
   - useComplaints manages all complaint state
   - Can be reused across components
   - Separates logic from presentation

4. **Services/** - API abstraction
   - Mock service simulates backend
   - Easy to replace with real API later
   - Centralizes data fetching logic

## Pages Overview

### Landing Page
- Hero section with CTA buttons
- Feature cards with icons
- Benefits section
- Responsive footer

### Dashboard
- Statistics cards (total, pending, in-progress, resolved)
- Search bar with real-time filtering
- Status filter dropdown
- Grid/Table view toggle
- Complaint cards with actions

### Add Complaint
- Form with validation
- Title, description, category, department fields
- File upload UI (image/video)
- Success confirmation screen

### Complaint Details
- Full complaint information
- Media display
- Status update button
- Delete functionality
- Navigation back to dashboard

## Styling (Tailwind CSS)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible layouts with Flexbox and Grid

### Status Colors
- **Pending**: Yellow (`bg-yellow-100 text-yellow-800`)
- **In Progress**: Blue (`bg-blue-100 text-blue-800`)
- **Resolved**: Green (`bg-green-100 text-green-800`)

### Common Patterns
- Cards with shadows and hover effects
- Consistent spacing with padding/margin
- Rounded corners for modern look
- Focus states for accessibility

## Data Flow

1. **Mock Data** → dummyData.js
2. **Service Layer** → complaintService.js (simulates API)
3. **Custom Hook** → useComplaints.js (manages state)
4. **Components** → Display and interact with data

## Future Backend Integration

### Where to Connect APIs

1. **services/complaintService.js**
   Replace mock functions with real API calls:
   ```javascript
   // Instead of:
   await delay(800);
   return [...dummyComplaints];
   
   // Use:
   const response = await fetch('/api/complaints');
   return response.json();
   ```

2. **hooks/useComplaints.js**
   Already structured for API integration:
   - Loading states
   - Error handling
   - State updates

3. **Components**
   No changes needed - they work with the hook interface

## Running the Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Accessibility Features

- Semantic HTML tags (`<header>`, `<main>`, `<section>`, `<form>`)
- ARIA labels for interactive elements
- Focus states for keyboard navigation
- Color contrast compliance
- Responsive text sizes

## Performance Optimizations

- Lazy loading with React Router
- Image loading="lazy" attribute
- Efficient re-renders with proper state management
- Minimal dependencies
