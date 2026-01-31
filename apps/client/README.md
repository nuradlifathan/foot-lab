# Foot Lab - Client

The frontend application for Foot Lab, built with modern web technologies.

## Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/Data**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## Project Structure

```
src/
├── api/            # API integration
├── components/     # UI Components
│   ├── layout/     # Layout components (Sidebar, etc)
│   ├── ui/         # shadcn/ui primitives
│   └── ...         # Feature components
├── lib/            # Utilities (cn, etc)
├── pages/          # Page views
└── ...
```

## Available Scripts

### `pnpm dev`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `pnpm build`
Builds the app for production to the `build` folder.

### `pnpm preview`
Locally preview production build.
