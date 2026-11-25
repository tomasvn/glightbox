# Contributing to GLightbox.js

Please read these guidelines before contributing code.

## :nut_and_bolt: Setting up the development environment

- Fork and clone the repository
- Use Node.js `>=22.23.4` (Node.js 24 recommended) and npm `>=10.9` for the development tools
- `npm install`
- `npm run watch`
- This repository uses npm workspaces: `packages/glightbox` contains the publishable library, `packages/docs` contains the private Astro Starlight site and demo, and `packages/build` contains private build tooling.
- Edit library JavaScript and CSS in `packages/glightbox/src`. The watcher compiles changes into `packages/glightbox/dist` and syncs them to `packages/docs/public/dist`; do not edit generated files directly.
- Run `npm run build:lib` to build the library, `npm test` for library and type tests, or `npm run build` to build both workspaces.
- Run `npm run dev:docs` to preview Starlight. Documentation pages live in `packages/docs/src/content/docs`; demo source and media live in `packages/docs/public`.
- The documentation changelog page is generated from `packages/glightbox/CHANGELOG.md` before development and production builds. Edit the library changelog, not the generated page.
- Install dependencies from the repository root and commit the root `package-lock.json`. Do not create per-workspace lockfiles.

## :bug: Fixing a Bug

When fixing a bug please make sure to test it in several browsers including ie11. If you are not able to do so, mention that in a PR comment, so other contributors can do it. Once your code is working, run `npm run lint` to check it with Oxlint.

## :tada: Proposing a Change

When implementing a feature please create an issue first explaining your idea and asking whether there's need for such a feature. Remember the script's core philosophy is to stay simple and minimal, doing one thing and doing it right.

## :pencil: Before you open a Pull Request

- Follow the same coding style.
- Run `npm run lint` and fix any errors. Use `npm run format` to format source JavaScript with Oxfmt.
- **DO NOT** manually edit files in `packages/glightbox/dist`; these files are created automatically.
- Follow Git best practices (especially use meaningful commit messages).
- Describe thoroughly you work in a PR comment.
- Be patient and understanding. It's a side project, done in free time.

## :memo: Changesets and releases

For changes that should appear in a release, run `npm run changeset`, select `@tomasvn/glightbox`, choose the appropriate patch, minor, or major version bump, and write a user-facing summary. Commit the generated file in `.changeset` with your change. Documentation-only or other changes that do not need a release do not require a changeset.

Run release commands from the repository root. Changesets updates the library version and changelog in `packages/glightbox`; the root, documentation, and build packages are private. To inspect the published package, run `npm pack --workspace @tomasvn/glightbox --dry-run`.

To build the library and validate publishing without uploading a release, run:

```sh
npm run build:lib
npm publish --workspace @tomasvn/glightbox --dry-run
```

Always target the library workspace when publishing. Running `npm publish --dry-run` without `--workspace` targets the private root package, which has no version and can cause npm to fail with `Cannot read properties of null (reading 'prerelease')`.

Thank you to everyone who has contributed to GLightbox.js!
