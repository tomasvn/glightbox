# Contributing to GLightbox.js

Please read these guidelines before contributing code.

## :nut_and_bolt: Setting up the development environment

- Fork and clone the repository
- Use Node.js `^22.12`, `^24`, or `>=26` and npm `>=10.9` for the development tools
- `npm install`
- `npm run watch`
- To update js and css files, use the `src` folder: src/js/glightbox.js and src/postcss/glightbox.css These files will be compiled automatically with every change to the `dist` folder (do not modify the dist files directly)

## :bug: Fixing a Bug

When fixing a bug please make sure to test it in several browsers including ie11. If you are not able to do so, mention that in a PR comment, so other contributors can do it. Once your code is working, run `npm run lint` to check it with Oxlint.

## :tada: Proposing a Change

When implementing a feature please create an issue first explaining your idea and asking whether there's need for such a feature. Remember the script's core philosophy is to stay simple and minimal, doing one thing and doing it right.

## :pencil: Before you open a Pull Request

- Follow the same coding style.
- Run `npm run lint` and fix any errors. Use `npm run format` to format source JavaScript with Oxfmt.
- **DO NOT** commit changes in the dist directory, this files are created automatically.
- Follow Git best practices (especially use meaningful commit messages).
- Describe thoroughly you work in a PR comment.
- Be patient and understanding. It's a side project, done in free time.

## :memo: Changesets and releases

For changes that should appear in a release, run `npm run changeset`, select `@tomasvn/glightbox`, choose the appropriate patch, minor, or major version bump, and write a user-facing summary. Commit the generated file in `.changeset` with your change. Documentation-only or other changes that do not need a release do not require a changeset.

Thank you to everyone who has contributed to GLightbox.js!
