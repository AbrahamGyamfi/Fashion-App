import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';  // ← change this line
import App from '../App';
import axios from 'axios';

// Mock axios to prevent network calls
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
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