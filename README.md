# PokerPower Utility Library

A JavaScript utility library for use with the PokerPower Webflow website.

This repo is used to organize, version, and maintain reusable scripts across the site, including navigation logic, animations, and other frontend behaviors.

## Structure

- `src/`: Source files, organized by functionality.
- `dist/`: Minified and production-ready build used in Webflow via UNPKG.
- `.gitignore`: Excludes local development files and node_modules.
- `package.json`: Project metadata and dependencies.
- `vite.config.js`: Build configuration using Vite.

## Usage in Webflow

Include the production script from UNPKG at the end of the `<body>`:

```html
<script src="https://unpkg.com/pokerpower_utility@latest/dist/pokerpower.min.js"></script>
```

This will load the latest version of the utility library into Webflow.

## Manual Initialization

Functions marked for `autoInit` will run automatically on page load.

To manually run a function:

```js
PokerPower.initLazyYouTube();
```

## Development

To build the minified output:

```bash
npm install
npm run build
```

This will update the `dist/` folder with a new bundled version.
