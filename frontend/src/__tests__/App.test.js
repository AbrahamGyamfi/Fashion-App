import { render, screen, waitFor, act } from '@testing-library/react';
import App from '../App';
import axios from 'axios';

// Mock axios to prevent network calls
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    
    // Mock axios to return empty array
    axios.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  it('should have main container', async () => {
    let container;
    await act(async () => {
      ({ container } = render(<App />));
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container.firstChild).toBeInTheDocument();
  });
});