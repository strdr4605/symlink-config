# symlink-config

A tool to symlink your project config files to root

## Why

To make the root of your project cleaner when checking on repo hub.

## Usage

```bash
npm i symlink-config
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

