# Testing Guide - Event Storming Designer

Complete guide for running and understanding tests in the Event Storming Designer application.

## Quick Start

### Run All Tests

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

## Test Structure

```
eventstorming-designer/
├── server/
│   └── src/
│       └── __tests__/
│           ├── aiService.test.ts      # AI service unit tests
│           └── routes.test.ts         # API route integration tests
│
├── client/
│   └── src/
│       └── __tests__/
│           ├── components/
│           │   ├── StepIndicator.test.tsx
│           │   └── CostTracking.test.tsx
│           └── context/
│               └── SessionContext.test.tsx
```

## Backend Tests

### Test Files

#### `aiService.test.ts` (12 tests)

Tests all AI service methods with mocked Anthropic API:

```typescript
describe('AIService', () => {
  it('should analyze business requirements');
  it('should suggest domain events');
  it('should suggest commands');
  it('should identify aggregates');
  it('should identify bounded contexts');
  it('should generate PRD');
  it('should recommend API type');
  it('should generate REST endpoints');
  it('should generate GraphQL schema');
  it('should design microservices');
  it('should explain concepts');
  it('should calculate costs correctly');
});
```

**Key Testing Patterns**:
- Mocks Anthropic SDK
- Tests token usage calculation
- Validates response structure
- Checks cost computation accuracy

#### `routes.test.ts` (15 tests)

Tests all API endpoints with Express and Supertest:

```typescript
describe('Event Storming API Routes', () => {
  // Business requirements
  POST /api/event-storming/analyze-requirements

  // Event storming phases
  POST /api/event-storming/suggest-events
  POST /api/event-storming/suggest-commands
  POST /api/event-storming/identify-aggregates
  POST /api/event-storming/identify-contexts

  // Learning
  POST /api/event-storming/explain
});

describe('PRD API Routes', () => {
  POST /api/prd/generate
  GET  /api/prd/:id
});

describe('API Design Routes', () => {
  POST /api/api-design/recommend-type
  POST /api/api-design/generate-rest
  POST /api/api-design/generate-graphql
  POST /api/api-design/design-microservices
});

describe('Cost Tracking Routes', () => {
  GET /api/cost/:sessionId
  GET /api/cost/
});
```

**Key Testing Patterns**:
- Supertest for HTTP testing
- Mock AIService responses
- Validate status codes
- Check response structure

### Running Backend Tests

```bash
cd server

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- aiService.test.ts

# Run specific test suite
npm test -- --testNamePattern="AIService"
```

### Expected Output

```
PASS src/__tests__/aiService.test.ts
  AIService
    ✓ should analyze business requirements and return response with cost (10 ms)
    ✓ should suggest domain events (2 ms)
    [... 10 more passing tests]

PASS src/__tests__/routes.test.ts
  Event Storming API Routes
    POST /api/event-storming/analyze-requirements
      ✓ should analyze business requirements successfully (39 ms)
      ✓ should handle missing parameters (60 ms)
    [... 13 more passing tests]

Test Suites: 2 passed, 2 total
Tests:       27 passed, 27 total
Time:        4.952 s
```

## Frontend Tests

### Test Files

#### `SessionContext.test.tsx` (7 tests)

Tests React Context state management:

```typescript
describe('SessionContext', () => {
  it('provides initial session state');
  it('updates current step');
  it('sets business requirement');
  it('adds domain events');
  it('adds cost tracking');
  it('resets session');
  it('accumulates multiple costs');
});
```

**Key Testing Patterns**:
- renderHook from @testing-library/react
- act() for state updates
- Context provider wrapping
- State assertion

#### `StepIndicator.test.tsx` (4 tests)

Tests progress indicator component:

```typescript
describe('StepIndicator', () => {
  it('renders all steps');
  it('highlights current step');
  it('shows check marks for completed steps');
  it('displays step descriptions');
});
```

**Key Testing Patterns**:
- Component rendering
- Props validation
- Visual state testing
- Conditional rendering

#### `CostTracking.test.tsx` (5 tests)

Tests cost display component:

```typescript
describe('CostTracking', () => {
  it('renders cost tracking headers');
  it('displays initial cost as zero');
  it('shows message when no API calls made');
  it('renders cost breakdown section');
  it('displays informational note about costs');
});
```

**Key Testing Patterns**:
- Component with Context
- Number formatting
- Empty states
- Information display

### Running Frontend Tests

```bash
cd client

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test StepIndicator.test.tsx

# Run with UI
npx vitest --ui
```

### Expected Output

```
✓ src/__tests__/context/SessionContext.test.tsx  (7 tests) 35ms
✓ src/__tests__/components/StepIndicator.test.tsx  (4 tests) 127ms
✓ src/__tests__/components/CostTracking.test.tsx  (5 tests) 167ms

Test Files  3 passed (3)
     Tests  16 passed (16)
  Duration  3.83s

% Coverage report from v8
File               | % Stmts | % Branch | % Funcs | % Lines
StepIndicator.tsx  |     100 |      100 |     100 |     100
SessionContext.tsx |   98.34 |    83.33 |     100 |   98.34
CostTracking.tsx   |   71.42 |       75 |     100 |   71.42
```

## Writing New Tests

### Backend Test Template

```typescript
import request from 'supertest';
import express from 'express';

// Mock dependencies
jest.mock('../services/aiService');

import myRoutes from '../routes/myRoutes';

describe('My Route Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/my-route', myRoutes);
  });

  it('should do something', async () => {
    const response = await request(app)
      .post('/api/my-route/endpoint')
      .send({ data: 'test' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result');
  });
});
```

### Frontend Test Template

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent prop="value" />);

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const { user } = render(<MyComponent />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('After Click')).toBeInTheDocument();
  });
});
```

## Testing Best Practices

### 1. Test Naming

```typescript
// ✅ Good - descriptive and specific
it('should return 404 when PRD not found');
it('should calculate cost based on token usage');

// ❌ Bad - vague
it('works');
it('test 1');
```

### 2. Test Structure (AAA Pattern)

```typescript
it('should update session cost', () => {
  // Arrange
  const { result } = renderHook(() => useSession());

  // Act
  act(() => {
    result.current.addCost('Test', 100, 0.01);
  });

  // Assert
  expect(result.current.costTracking.totalCost).toBe(0.01);
});
```

### 3. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@anthropic-ai/sdk');

// Mock modules
vi.mock('axios');

// Mock functions
const mockFn = jest.fn().mockResolvedValue({ data: 'test' });
```

### 4. Test Edge Cases

```typescript
describe('Cost Calculation', () => {
  it('handles zero tokens');
  it('handles negative values');
  it('handles very large numbers');
  it('handles decimal precision');
});
```

### 5. Keep Tests Isolated

```typescript
// ✅ Good - each test is independent
beforeEach(() => {
  // Reset state before each test
  cleanup();
});

// ❌ Bad - tests depend on each other
let sharedState;
it('test 1', () => { sharedState = 'value'; });
it('test 2', () => { expect(sharedState).toBe('value'); });
```

## Debugging Tests

### Backend Debugging

```bash
# Run with verbose output
npm test -- --verbose

# Run single test
npm test -- --testNamePattern="specific test name"

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Debugging

```bash
# Run with UI
npx vitest --ui

# Debug in browser
npm run test:watch
# Then press 'd' to debug

# See test output
npm test -- --reporter=verbose
```

### Common Issues

**Issue**: Tests timeout
```typescript
// Solution: Increase timeout
it('long running test', async () => {
  // test code
}, 10000); // 10 second timeout
```

**Issue**: Mock not working
```typescript
// Solution: Ensure mock is before import
jest.mock('./module');
import { something } from './module';
```

**Issue**: Component not rendering
```typescript
// Solution: Wrap in providers
render(
  <SessionProvider>
    <Component />
  </SessionProvider>
);
```

## Coverage Reports

### View Coverage

```bash
# Backend
cd server && npm test
# Coverage report in server/coverage/

# Frontend
cd client && npm test
# Coverage report in client/coverage/
```

### HTML Coverage Report

```bash
# Open in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Configure in `package.json`:

```json
{
  "jest": {
    "coverageThresholds": {
      "global": {
        "branches": 50,
        "functions": 50,
        "lines": 50,
        "statements": 50
      }
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm run install:all

      - name: Run backend tests
        run: cd server && npm test

      - name: Run frontend tests
        run: cd client && npm test
```

## Test Checklist

Before committing code, ensure:

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Coverage hasn't decreased significantly
- [ ] No skipped or disabled tests
- [ ] Tests are meaningful and maintainable

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)

---

**Last Updated**: October 23, 2025
**Maintained By**: Event Storming Designer Team
