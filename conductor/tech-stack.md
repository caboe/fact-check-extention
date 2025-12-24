# Technology Stack

This document outlines the technology stack used for the Fact Check Extension.

## Frontend

- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
  - We use TypeScript to ensure type safety and improve code quality and maintainability.

- **Core Framework:** [Svelte](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/)
  - Svelte is used for building reactive user interfaces. SvelteKit provides a framework for structuring the application, including routing and server-side rendering capabilities, adapted for a browser extension context.

- **UI Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - A utility-first CSS framework for rapidly building custom designs. It is used in conjunction with the Skeleton UI toolkit.

- **UI Toolkit:** [Skeleton](https://www.skeleton.dev/)
  - A Svelte-based component library that provides pre-built, accessible UI components.

## Build & Development

- **Build Tool:** [Vite](https://vitejs.dev/)
  - A modern frontend build tool that provides a faster and leaner development experience.

- **Testing Framework:** [Playwright](https://playwright.dev/)
  - Used for end-to-end testing to ensure the extension works as expected in a real browser environment.

- **Code Quality:**
  - **[ESLint](https://eslint.org/):** For identifying and reporting on patterns in JavaScript and TypeScript code.
  - **[Prettier](https://prettier.io/):** An opinionated code formatter to ensure consistent code style across the project.
