# symlink-config

A tool to symlink your project config files to root

## Why

Make the root of your project cleaner when checking on the repo hub.

## Demo

You can check this repo! It has configs for eslint, prettier, lint-staged, husky, and commitlint.  
All configs are in [./support/root](/support/root).

## Usage

```bash
npm install symlink-config
```

In package.json:

```json
  "scripts": {
    "prepare": "npx symlink-config"
  }
```

Move and link a config file

```bash
npx symlink-config .eslintrc.js # will move the eslint config to ./support/root/ by default
```

If you want to change the name of your sourceDir for config files:

```json
  "scripts": {
    "prepare": "npx symlink-config"
  },
  "symlink-config": {
    "path": "./allRootConfigs"
  }
```
