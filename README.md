![prosemirror-dev-tools](/docs/assets/logo.png)
<p align="center">
  <a href="https://npmjs.org/package/prosemirror-dev-tools">
    <img src="https://img.shields.io/npm/v/prosemirror-dev-tools.svg" alt="NPM Version">
  </a>

  <a href="http://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/prosemirror-dev-tools.svg" alt="License">
  </a>

  <a href="https://github.com/d4rkr00t/prosemirror-dev-tools/issues">
    <img src="https://img.shields.io/github/issues/d4rkr00t/prosemirror-dev-tools.svg" alt="Github Issues">
  </a>

  <a href="https://travis-ci.org/d4rkr00t/prosemirror-dev-tools">
    <img src="https://img.shields.io/travis/d4rkr00t/prosemirror-dev-tools.svg" alt="Travis Status">
  </a>

  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly">
  </a>
</p>

## Table of Content

* [Quick Start](#quick-start)
* [Features](#features)
  * [State](#state)
  * [History](#history)
  * [Plugins](#plugins)
  * [Schema](#schema)
  * [Structure](#structure)
  * [Snapshots](#snapshots)
* [Demo](#demo)
* [Contributing](#contributing)
* [License](#license)

## Quick Start

### NPM Way

Install `prosemirror-dev-tools` package from npm:

```sh
npm install --save-dev prosemirror-dev-tools
```

Wrap `EditorView` instance in applyDevTools method:

```js
import applyDevTools from "prosemirror-dev-tools";

const view = new EditorView(/*...*/);

applyDevTools(view);
```

### CDN way

Add script tag to your html file:

```html
<script src="https://unpkg.com/prosemirror-dev-tools@1.3.2/dist/umd/prosemirror-dev-tools.min.js"></script>
```

Wrap `EditorView` instance in applyDevTools method:

```js
const view = new EditorView(/*...*/);

// From version 1.3.1 it's required for UMD build to provide EditorState class (not instance).
// Previously it was causing different artifacts when working with state e.g. rolling back to some history checkpoint
// or when restoring from snapshot due to EditorState classes were different in UMD bundle and in actual client code.
ProseMirrorDevTools.applyDevTools(view, { EditorState: EditorState });
```

## Features

### State

* Inspect document – all nodes and marks
* Inspect selection – position, head, anchor and etc.
* Inspect active marks
* See document stats – size, child count

![prosemirror-dev-tools state tab](/docs/assets/state-tab.png)

### History

* Inspect document changes over time
* Time travel between states
* See selection content for particular state in time
* See selection diff

![prosemirror-dev-tools history tab](/docs/assets/history-tab.png)


### Plugins

Inspect state of each plugin inside prosemirror.

![prosemirror-dev-tools plugins tab](/docs/assets/plugins-tab.png)

### Schema

Inspect current document schema with nodes and marks.

![prosemirror-dev-tools schema tab](/docs/assets/schema-tab.png)

### Structure

Visual representation of current document tree with positions at the beginning and the end of every node.

![prosemirror-dev-tools structure tab](/docs/assets/structure-tab.png)

### Snapshots

Snapshots allow you to save current editor state and restore it later. State is stored in local storage.

![prosemirror-dev-tools snapshots tab](/docs/assets/snapshots-tab.png)

## Demo

* [Demo](https://codepen.io/iamsysoev/full/QvpELv/) of prosemirror-dev-tools on codepen.io.
* [Example Setup](/example)

## Contributing

Contributions are highly welcome! This repo is commitizen friendly — please read about it [here](http://commitizen.github.io/cz-cli/).

## License

- **MIT** : http://opensource.org/licenses/MIT
