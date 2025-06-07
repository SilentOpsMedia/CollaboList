# Architecture Overview

## System Design
- **Frontend**: React with TypeScript
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Styling**: Tailwind CSS

## Key Decisions
- [Authentication Flow](decisions/0001-authentication-flow.md)
- [State Management](decisions/0002-state-management.md)

## Directory Structure
```
src/
├── components/    # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── services/      # API and service layers
└── utils/         # Utility functions
```
