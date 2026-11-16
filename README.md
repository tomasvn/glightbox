# GLightbox

A lightweight JavaScript lightbox for images, videos, iframes, and inline content. This fork is published as `@tomasvn/glightbox`.

## Documentation

- [Documentation](https://tomasvn.github.io/glightbox/)
- [Interactive demo](https://tomasvn.github.io/glightbox/demo.html)
- [Library usage and options](./packages/glightbox/README.md)
- [Examples](./packages/glightbox/EXAMPLES.md)
- [Changelog](./packages/glightbox/CHANGELOG.md)
- [License](./packages/glightbox/LICENSE.md)
- [Ko-fi](https://ko-fi.com/tomasvn1994)

## Install the library

```sh
npm install @tomasvn/glightbox
```

```js
import GLightbox from '@tomasvn/glightbox';
import '@tomasvn/glightbox/dist/css/glightbox.css';

const lightbox = GLightbox();
```

## Repository

This repository uses npm workspaces with a single root lockfile:

| Workspace            | Purpose                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `packages/glightbox` | Publishable library, source, builds, tests, and type declarations |
| `packages/docs`      | Private Astro Starlight documentation site and demo               |
| `packages/build`     | Private library build and watch tooling                           |

Use Node.js 24 (or at least 22.23.4) and npm 10.9 or newer.

```sh
npm install
npm run build       # Build the library, then the documentation
npm test           # Library and TypeScript contract tests
npm run lint       # Library JavaScript linting
npm run watch      # Watch library sources
npm run dev:docs   # Start the documentation server
```

Run commands from the repository root. For workspace-specific commands:

```sh
npm run build --workspace @tomasvn/glightbox
npm run build --workspace @tomasvn/glightbox-docs
npm pack --workspace @tomasvn/glightbox --dry-run
```

The demo source and media live in `packages/docs/public`. The documentation build copies only library distribution assets into `packages/docs/public/dist`, which is generated and ignored by Git. GitHub Pages deployment builds the library and documentation and publishes `packages/docs/dist`. Select **GitHub Actions** as the Pages source in repository settings.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development and release instructions.

## License

[MIT](./LICENSE.md)
