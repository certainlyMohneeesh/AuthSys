# Authentication Microservice

A complete authentication system that can be easily integrated into any Next.js project.

## Features

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Password reset flow
- Email notifications
- TypeScript support
- UI components included
- Prisma database integration

## Installation

```bash
npm install @your-org/auth-service
```

## Setup

1. Add required environment variables to your `.env`:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
MAILTRAP_API_KEY=""
```

2. Import and use the components:

```tsx
import { SignIn, SignUp, AuthProvider } from '@your-org/auth-service';

// Wrap your app with AuthProvider
function App({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

// Use the components
function LoginPage() {
  return <SignIn />;
}
```

3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

## Documentation

For detailed documentation and examples, visit [docs-url].

## License

MIT