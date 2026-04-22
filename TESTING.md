# Test Suite

## Backend Tests

### Running Tests
```bash
cd backend
npm install
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode for development
npm run test:ci          # CI mode (used in pipeline)
```

### Test Structure
- `__tests__/health.test.js` - Basic health checks
- `__tests__/products.test.js` - Products API unit tests
- `__tests__/auth.test.js` - Authentication integration tests

### Coverage
Tests generate coverage reports in `backend/coverage/`

## Frontend Tests

### Running Tests
```bash
cd frontend
npm install
npm test                 # Interactive watch mode
npm run test:ci          # CI mode with coverage
```

### Test Structure
- `src/__tests__/App.test.js` - App component tests
- `src/__tests__/components.test.js` - Component unit tests
- `src/setupTests.js` - Test configuration

## CI/CD Integration

Tests run automatically on:
- Every push to `dev`, `stage`, `main`
- Every pull request
- Before deployment

### Pipeline Flow
```
1. Install dependencies
2. Run backend tests
3. Run frontend tests
4. Generate coverage reports
5. Security scans
6. Build (if tests pass)
7. Deploy (if on stage/main)
```

## Writing New Tests

### Backend Example
```javascript
describe('My API', () => {
  it('should do something', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### Frontend Example
```javascript
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Test Coverage Goals
- Unit Tests: 70%+
- Integration Tests: 50%+
- Critical Paths: 90%+
