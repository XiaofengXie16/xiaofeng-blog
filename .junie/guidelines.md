# Development Guidelines for Xiaofeng Blog

This document provides essential information for developers working on this project. It covers build/configuration instructions, testing procedures, and other development guidelines.

## Build and Configuration

### Prerequisites

- Node.js >= 18.0.0 (as specified in package.json)
- npm or bun (project includes bun.lockb)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/XiaofengXie16/xiaofeng-blog.git
   cd xiaofeng-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if using bun
   bun install
   ```

### Development

Start the development server:
```bash
npm run dev
# or
bun run dev
```

This uses React Router's development server and will be available at http://localhost:3000 by default.

### Building for Production

Build the project:
```bash
npm run build
# or
bun run build
```

The build output will be in the `build` directory.

### Deployment

The project is configured for deployment to Fly.io:
```bash
npm run deploy
# or
bun run deploy
```

This runs `fly deploy --remote-only` to deploy the application.

## Testing

### Test Configuration

The project uses Vitest for testing with the following configuration:
- JSDOM as the test environment (for simulating browser DOM)
- Global test functions enabled
- Setup file at `setupTests.ts` for any global test configuration

### Running Tests

Run tests using Vitest:
```bash
npx vitest run
# or for watch mode
npx vitest
```

Consider adding a test script to package.json for convenience:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Writing Tests

Tests are located in the `app/__tests__` directory. Follow these guidelines when writing tests:

1. Name test files with the `.test.ts` or `.test.tsx` extension
2. Use the describe/it pattern for organizing tests
3. Import testing utilities from vitest:
   ```typescript
   import { describe, it, expect } from 'vitest';
   ```

#### Example Test

Here's an example test for the markdown utility:

```typescript
import { describe, it, expect } from 'vitest';
import { parseMarkdownWithPreview } from '../utils/markdown';

describe('parseMarkdownWithPreview', () => {
  it('should parse markdown with front matter', () => {
    const markdown = `---
title: Test Post
date: 2023-01-01
---

# Heading 1

This is a paragraph with **bold** text.`;

    const result = parseMarkdownWithPreview(markdown);

    // Check front matter
    expect(result.frontMatter).toEqual({
      title: 'Test Post',
      date: '2023-01-01'
    });

    // Check HTML contains expected elements
    expect(result.html).toContain('<h1>Heading 1</h1>');
    expect(result.html).toContain('<strong>bold</strong>');
  });
});
```

## Code Style and Development Guidelines

### Project Structure

- `app/`: Main application code
  - `assets/`: Static assets
  - `blogs/`: Blog content
  - `components/`: React components
  - `constants/`: Constant values
  - `context/`: React context providers
  - `routes/`: Route components
  - `utils/`: Utility functions
- `public/`: Public static files

### TypeScript

- The project uses TypeScript with strict type checking
- Path aliases are configured with `~/*` mapping to `./app/*`
- Use type annotations for function parameters and return types

### React Router

- The project uses React Router v7
- Routes are defined in the `app/routes` directory
- File-based routing is used with `@react-router/fs-routes`

### Styling

- The project uses Tailwind CSS for styling
- The Tailwind configuration is in `tailwind.config.js`
- Typography plugin is used for rich text styling

### Blog Content

- Blog posts are stored as Markdown files
- Front matter is used for metadata (title, date, etc.)
- The `parseMarkdownWithPreview` utility is used to parse markdown content

### Linting and Formatting

- The project uses oxlint for linting
- Prettier is used for code formatting with tailwindcss plugin
- Husky is used for git hooks to run linting before commits

## Troubleshooting

### Common Issues

1. **Missing setupTests.ts file**: If you encounter an error about a missing setupTests.ts file, create an empty file at the root of the project.

2. **Type errors**: Run `npm run typecheck` to check for type errors.

3. **Build errors**: Make sure all dependencies are installed and that you're using a compatible Node.js version.
