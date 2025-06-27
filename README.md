# Dynamic Scroll Interface Challenge

This project is a high-fidelity solution to a frontend developer technical task. It implements a sophisticated, "cinematic" scrolling interface that seamlessly transitions between vertical and horizontal content sections based on a single, continuous user scroll action.

The application is built using a modern, cutting-edge tech stack to demonstrate proficiency in contemporary frontend development practices.

**Live Demo:** https://dynamic-scrollable-interface.vercel.app/


## The User Experience Journey

The core of this project is a carefully choreographed user journey designed to be seamless and engaging:

1. **Phase 1 (Vertical):** The experience begins with a standard vertical scroll, dynamically loading items 1 through 20.
2. **Phase 2 (Pinned Horizontal):** Upon reaching item 20, the interface transitions. The main vertical scroll action is "hijacked" to control a horizontal "film strip" of items 21-30. The section is pinned to the viewport, and continued vertical scrolling moves the content horizontally, creating a cinematic effect.
3. **Phase 3 (Vertical):** Once the horizontal journey is complete, the layout seamlessly returns to standard vertical scrolling for the final items, 31 through 50.

This entire experience is controlled by a single browser scrollbar, eliminating jarring context switches or the need for nested scrollbars.

## Tech Stack & Architectural Choices

This project was built with a specific set of modern technologies to showcase robust and forward-thinking development patterns.

* **Framework:** **Next.js 15 (App Router)**
  * **Why?** Chosen for its best-in-class developer experience, performance optimizations (React Server Components), and seamless setup for a production-ready React + TypeScript environment.
* **Language:** **TypeScript**
  * **Why?** To ensure type safety, improve code quality, and make the codebase more robust and maintainable, which is critical for complex state logic.
* **Styling:** **Tailwind CSS v4**
  * **Why?** Leveraged for its utility-first approach to building responsive, custom designs rapidly. The v4 engine simplifies the setup by integrating directly into CSS without extra config files.
* **State Management:** **React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)**
  * **Why?** For a self-contained, single-component challenge like this, using React's built-in hooks is the most efficient and correct approach. A global state manager like Redux or Zustand would be unnecessary over-engineering. The logic is complex but remains local to the component.

## Key Technical Implementation

The most significant challenge was creating the seamless transition to the horizontal section without nested scrollbars. This was solved using the **Pinned Scroll (or "Scroll Jacking")** technique.

### How the Pinned Scroll Works

1. **The Track:** A tall, empty parent `div` (`<div style={{ height: '4000px' }}>`) is created. Its height dictates the number of vertical scroll pixels required to complete the horizontal animation. This is what "locks" the user into the horizontal phase.
2. **The Sticky Viewport:** A child `div` with `position: sticky` and `top: 0` is placed within the track. This element pins itself to the top of the browser window as soon as the user scrolls to it.
3. **The Movable Content:** Inside the sticky viewport, a wide `div` containing the horizontal items is moved sideways using `transform: translateX()`.
4. **The JavaScript Bridge:** A master `useEffect` scroll handler calculates the user's vertical scroll progress within the "track" and translates that percentage into a negative `translateX` value for the movable content. This creates the illusion that scrolling down is moving the content sideways.

This architecture solves the two most critical UX problems:

* It prevents the user from accidentally scrolling past the horizontal section.
* It provides immediate, one-to-one feedback, as the horizontal content moves in perfect sync with the user's scroll input.

## How to Run the Project Locally

1. **Clone the repository:**

    ```bash
    git clone https://github.com/darshanbajgain/dynamic-scrollable-interface.git
    cd dynamic-scrollable-interface
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

4. **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Assumptions and Limitations

* **Scroll Input:** The experience is primarily designed and optimized for a standard mouse wheel or trackpad vertical scroll.
* **Accessibility:** The "scroll jacking" pattern is a deliberate design choice for a cinematic effect, which comes with known accessibility trade-offs. Standard keyboard navigation (like using the down arrow) will jump through the sections rather than smoothly animating them. A production version would require additional work to enhance accessibility for all user inputs.