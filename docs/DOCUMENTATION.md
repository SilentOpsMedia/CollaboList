# Documentation Standards

This document outlines the documentation standards for the CollaboList project. These standards ensure consistency and clarity throughout the codebase.

## File Structure

```
src/
  components/     # Reusable UI components
  contexts/       # React context providers
  hooks/          # Custom React hooks
  lib/            # Library code and utilities
  services/       # API and service layer
  types/          # TypeScript type definitions
  utils/          # Utility functions
```

## Documentation Requirements

### 1. File Headers
Every file should start with a header comment that includes:
- File path
- Brief description of the file's purpose
- Author and creation date (for new files)
- Last modified date and author (for existing files)

Example:
```typescript
/**
 * @file src/components/auth/Login.tsx
 * @description Login form component for user authentication
 * @author Your Name
 * @created 2025-06-07
 * @lastModified 2025-06-07
 */
```

### 2. Component Documentation
Every React component should include:
- Component description
- Props documentation with types and descriptions
- Examples of usage
- Any side effects or important notes

Example:
```typescript
/**
 * Login Form Component
 * 
 * A form component that handles user authentication.
 * 
 * @component
 * @example
 * return <Login onSuccess={handleLogin} onError={handleError} />
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Callback for successful login
 * @param {Function} props.onError - Callback for login errors
 * @param {string} [props.initialEmail=""] - Initial email value
 * @returns {JSX.Element} Rendered login form
 */
```

### 3. Function Documentation
All functions should include:
- Description of what the function does
- Parameter documentation with types and descriptions
- Return value documentation
- Any errors that might be thrown
- Examples of usage

Example:
```typescript
/**
 * Validates user login credentials
 * 
 * @async
 * @function validateLogin
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<User>} Resolves with user data if valid
 * @throws {Error} If validation fails or server error occurs
 * 
 * @example
 * try {
 *   const user = await validateLogin('user@example.com', 'password123');
 *   console.log('Login successful:', user);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 */
```

### 4. Type Documentation
All TypeScript interfaces and types should be documented:

```typescript
/**
 * User profile information
 * 
 * @interface UserProfile
 * @property {string} id - Unique user identifier
 * @property {string} displayName - User's display name
 * @property {string} email - User's email address
 * @property {Date} createdAt - When the user was created
 * @property {Date} [lastLogin] - When the user last logged in (optional)
 */
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  createdAt: Date;
  lastLogin?: Date;
}
```

### 5. Inline Comments
Use inline comments to explain:
- Complex logic
- Workarounds for known issues
- Non-obvious code decisions
- TODO items that need future attention

Example:
```typescript
// Calculate the total price including tax
// Note: Using 20% VAT rate as per UK regulations
// TODO: Make tax rate configurable via environment variables
const total = subtotal * 1.2;
```

## Best Practices

1. **Keep it up-to-date**: Update documentation when code changes
2. **Be concise but thorough**: Explain the "why" not just the "what"
3. **Use consistent formatting**: Follow the examples above
4. **Document all public APIs**: Any function/component that's exported should be documented
5. **Use TypeScript effectively**: Leverage TypeScript's type system to make the code self-documenting

## Tools

- Use JSDoc for function and component documentation
- Use TypeScript for type safety
- Configure ESLint to enforce documentation rules
- Use Prettier for consistent code formatting

## Review Process

1. Code reviews should include documentation review
2. Update documentation when making changes to existing code
3. Use the `@todo` tag for planned improvements

## Examples

See the following files for reference:
- `src/contexts/AuthContext.tsx` - Comprehensive context documentation
- `src/services/userServices.ts` - Well-documented service functions
- `src/components/auth/Login.tsx` - Component documentation example

---

*Last updated: 2025-06-07*
