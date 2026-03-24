# Convelix AI Caller Information

## Summary
Convelix is an AI-powered calling platform that enables automated sales calls and lead management. The application integrates with Bland AI for voice calling capabilities and uses OpenAI for call transcript analysis. It features a React-based frontend with a Supabase backend for data storage and serverless functions.

## Structure
- **src/**: Frontend React application code
- **supabase/**: Backend serverless functions and database migrations
- **public/**: Static assets for the web application

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.5.x
**Build System**: Vite 5.4.x
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 18.3.x: Frontend UI library
- React Router 6.26.x: Application routing
- @supabase/supabase-js 2.50.0: Supabase client for database and auth
- @tanstack/react-query 5.56.x: Data fetching and state management
- shadcn/ui (via Radix UI): Component library
- Tailwind CSS 3.4.x: Utility-first CSS framework
- Axios 1.9.0: HTTP client for API requests
- Recharts 2.12.x: Charting library for analytics
- Zod 3.23.x: Schema validation

**Development Dependencies**:
- Vite 5.4.x: Build tool and development server
- TypeScript 5.5.x: Type checking and compilation
- ESLint 9.9.0: Code linting
- Tailwind CSS plugins: Typography and animation utilities

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Supabase Backend
**Functions**: 
- analyze-call-transcript: Analyzes call transcripts using OpenAI
- bulk-reanalyze-calls: Batch processing of call transcripts
- generate-report-insights: Creates analytics reports
- lead-webhook: Handles lead integration webhooks
- send-contact-email: Email notification service
- sync-leads: Synchronizes lead data with external systems

## Integrations
**AI Services**:
- Bland AI: Voice calling API integration
- OpenAI: Natural language processing for call analysis
- Vapi AI: Additional voice AI capabilities

**Data Storage**:
- Supabase: PostgreSQL database with authentication

## Main Components
**Frontend Structure**:
- Authentication system with protected routes
- Dashboard with analytics and reporting
- Lead management interface
- Call campaign management
- Settings and integration configuration

**Key Features**:
- AI-powered sales calls
- Call transcript analysis
- Lead scoring and qualification
- Campaign performance tracking
- Integration with external CRM systems

## Testing
**Framework**: Not explicitly defined in the repository
**Run Command**:
```bash
npm run lint
```