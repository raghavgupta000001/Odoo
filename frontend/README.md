# Expense Management Frontend

A modern React frontend for the expense management system built with Vite, React Router, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Login and registration with JWT tokens
- 💰 **Expense Management**: Submit and view expenses
- 📊 **Dashboard**: Overview of expense statistics
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean and intuitive interface with Tailwind CSS
- 🔄 **Real-time Updates**: Automatic refresh of expense data
- 📝 **Form Validation**: Client-side validation with react-hook-form
- 🎯 **Toast Notifications**: User feedback with react-hot-toast

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date manipulation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthPage.jsx
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── expense/
│   │   ├── ExpenseForm.jsx
│   │   └── ExpenseList.jsx
│   └── layout/
│       └── Header.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## API Integration

The frontend communicates with the backend through the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/expense/submit` - Submit new expense
- `GET /api/expense/my` - Get user's expenses

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Features Overview

### Authentication
- Secure login and registration
- JWT token management
- Automatic token refresh
- Protected routes

### Expense Management
- Submit new expenses with validation
- View all submitted expenses
- Real-time status updates
- Category-based organization

### Dashboard
- Expense statistics overview
- Quick access to common actions
- Responsive design for all devices

## Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by:
- Modifying `tailwind.config.js` for theme customization
- Updating `src/index.css` for global styles
- Adding custom CSS classes in `src/App.css`

### API Configuration
Update the API base URL in `src/services/api.js` to point to your backend server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.