# symlink-config 

![version](https://badgen.net/npm/v/symlink-config)
![npm downloads](https://badgen.net/npm/dm/symlink-config)
![dependents](https://badgen.net/npm/dependents/symlink-config)
![publish](https://badgen.net/packagephobia/publish/symlink-config)
[![Hits-of-Code](https://hitsofcode.com/github/strdr4605/symlink-config?branch=master)](https://hitsofcode.com/github/strdr4605/symlink-config/view?branch=master)

A tool to symlink your project config files to root

## Why

Make the root of your project cleaner when checking on the repo hub.  
[Keep your JavaScript repository clean](https://strdr4605.com/keep-your-java-script-repository-clean)

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
