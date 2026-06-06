# AI Healthcare System - Frontend

A modern, responsive healthcare dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of health metrics, AI predictions, and care schedules
- **AI Assistant**: Intelligent health companion for personalized insights
- **Medical Reports**: Upload and manage medical reports with AI-powered analysis
- **Medication Management**: Track medications, set reminders, and monitor adherence
- **Health Timeline**: Comprehensive timeline view of health events and trends
- **Hospital Finder**: Find nearby hospitals and emergency care facilities
- **Settings**: Manage profile, notifications, and app preferences

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material Symbols** - Icon library

## Project Structure

```
src/
├── components/       # React components
│   ├── Dashboard.tsx
│   ├── Sidebar.tsx
│   ├── MainContent.tsx
│   ├── RightSidebar.tsx
│   ├── AIAssistant.tsx
│   ├── MedicalReports.tsx
│   ├── Medication.tsx
│   ├── HealthTimeline.tsx
│   ├── HospitalFinder.tsx
│   └── Settings.tsx
├── hooks/           # Custom React hooks
│   ├── useReports.ts
│   ├── useMedications.ts
│   ├── useAIChat.ts
│   ├── useHealthTimeline.ts
│   └── useHospitalFinder.ts
├── services/        # API service layer
│   └── api.ts
├── types/           # TypeScript interfaces
│   └── index.ts
├── utils/           # Utility functions
│   └── formatDate.ts
└── constants/       # Application constants
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5175/`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend is designed to work with a backend API. The API service layer (`src/services/api.ts`) handles all HTTP requests with proper error handling and authentication.

### Endpoints

- `/reports` - Medical reports CRUD operations
- `/ai/chat` - AI assistant chat endpoint
- `/medications` - Medication management
- `/timeline` - Health timeline events
- `/hospitals` - Hospital finder
- `/user/profile` - User profile management
- `/user/settings` - User settings

## Design System

The application uses a custom design system based on Material Design 3 with:

- **Custom Colors**: royalBlue, emeraldGreen, crimsonRed
- **Typography**: Inter font family with custom scale
- **Spacing**: Consistent spacing tokens
- **Components**: Reusable UI components with consistent styling

## Best Practices

- **Modular Architecture**: Separation of concerns with services, hooks, and components
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Loading indicators for async operations
- **Responsive Design**: Mobile-first responsive layouts
- **Accessibility**: Semantic HTML and ARIA labels

## License

MIT
