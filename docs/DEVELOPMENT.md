# Development Guide

## Prerequisites
- Node.js 16+
- npm 8+
- Firebase CLI (if working with Firebase)

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy .env.example to .env)
4. Start development server:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run type-check` - Check TypeScript types

## Code Style
- Follow [TypeScript style guide](https://google.github.io/styleguide/tsguide.html)
- Use Prettier for code formatting
- Follow ESLint rules defined in `.eslintrc`
