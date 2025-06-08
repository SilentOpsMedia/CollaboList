# Testing Strategy

This document outlines the testing strategy for the CollaboList application.

## Test Categories

### @core Tests

Tests marked with `@core` are considered critical path tests that verify the most important functionality of the application. These tests should always pass and are run in CI/CD pipelines.

Core test areas include:
- Login/authentication flow
- Checklist CRUD operations
- User session persistence

### @integration Tests

Integration tests verify how different parts of the system work together. These are run less frequently than core tests.

### @e2e Tests

End-to-end tests that verify complete user flows. These are run before major releases.

## Running Tests

Run all tests:
```bash
npm test
```

Run only core tests:
```bash
npm test -- --testPathPattern="@core"
```

## Test Organization

- `tests/core/` - Critical path tests
- `tests/integration/` - Integration tests
- `tests/e2e/` - End-to-end tests

## Adding New Tests

1. Add tests for new functionality
2. Tag tests appropriately (`@core`, `@integration`, `@e2e`)
3. Ensure core tests remain fast and reliable
4. Update this README if adding new test categories or patterns
