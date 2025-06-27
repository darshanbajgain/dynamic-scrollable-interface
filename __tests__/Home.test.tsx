// __tests__/Home.test.tsx

import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../app/page';

jest.useFakeTimers();

describe('Dynamic Scroll Interface', () => {

    afterEach(() => {
        jest.clearAllTimers();
    });

    // TEST 1: Fixed to look for the correct text
    it('should render the main header', () => {
        render(<Home />);
        // FIX: Changed text to match the actual h1 content
        const headerElement = screen.getByText(/Dynamic Scroll Interface/i);
        expect(headerElement).toBeInTheDocument();
    });

    // TEST 2: Fixed to be more specific
    it('should load the first item automatically after the initial delay', async () => {
        render(<Home />);

        act(() => {
            jest.runAllTimers();
        });

        // FIX: Use `getByTestId` to find the specific item card, not just any "1"
        const firstItemCard = await screen.findByTestId('item-card-1');
        expect(firstItemCard).toBeInTheDocument();
    });

    // TEST 3: Fixed to be more specific and robust
    it('should load a new vertical item when the user scrolls down', async () => {
        render(<Home />);

        // Load Item #1
        act(() => {
            jest.runAllTimers();
        });
        const firstItemCard = await screen.findByTestId('item-card-1');
        expect(firstItemCard).toBeInTheDocument();

        // Mock the browser's scroll properties
        Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500, writable: true });
        Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, writable: true });

        // Simulate the user scrolling to the bottom
        act(() => {
            fireEvent.scroll(window, { target: { pageYOffset: 800 } });
        });

        // Fast-forward time for the new item's delay
        act(() => {
            jest.runAllTimers();
        });

        // FIX: Use `getByTestId` to specifically look for the card of the second item
        const secondItemCard = await screen.findByTestId('item-card-2');
        expect(secondItemCard).toBeInTheDocument();
    });
});