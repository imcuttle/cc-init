# cc-init

<!--
[![build status](https://img.shields.io/travis/imcuttle/cc-init/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/cc-init)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/cc-init.svg?style=flat-square)](https://codecov.io/github/imcuttle/cc-init?branch=master)
-->

[![NPM version](https://img.shields.io/npm/v/cc-init.svg?style=flat-square)](https://www.npmjs.com/package/cc-init)
[![NPM Downloads](https://img.shields.io/npm/dm/cc-init.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/cc-init)

Set commitlint & conventional-changelog quickly

## Why?

I need to write and install lots of works when I want to use [`commitlint`](https://github.com/marionebl/commitlint) with [`@moyuyc/husky`](https://github.com/imcuttle/husky) and [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog), [commitizen](https://github.com/commitizen/cz-cli) for conventional changelog.

```json
{
  "scripts": {
    "version": "npm run changelog",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS"
    }
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/foo"
    }
  }
  "devDependencies": {
    "@commitlint/cli": "^7.1.1",
    "@commitlint/config-conventional": "^7.1.1",
    "conventional-changelog-cli": "^2.0.5",
    "@moyuyc/husky": "^1.1.1"
  }
}
```

So the package can help you setting commitlint & conventional-changelog quickly.

## Usage

### CLI

```bash
npm install cc-init -g
# or use yarn
yarn global add cc-init
cc-init -h
```

### Package

```javascript
import ccInit from 'cc-init'
ccInit(cwd, {
  // ...options
})
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### cli

[bin.js:32-41](https://github.com/imcuttle/cc-init/blob/43ab0cb7f675ecd0c88ab37001752f7b93981af9/bin.js#L32-L41 'Source code on GitHub')

```bash
export CHANGELOG_PRESET=@baidu/befe
export CHANGELOG_PRESET_PKGNAME=@baidu/conventional-changelog-befe
export COMMITIZEN_ADAPATOR=@baidu/cz-conventional-changelog-befe
export NPM_REGISTRY=http://registry.npm.baidu-int.com
export COMMITLINT_PRESET=@baidu/commitlint-config-befe
# Preset the default values
cc-init
```

### ccInit

[index.js:36-166](https://github.com/imcuttle/cc-init/blob/43ab0cb7f675ecd0c88ab37001752f7b93981af9/index.js#L36-L166 'Source code on GitHub')

make commitlint, husky and conventional-changelog getting along harmoniously together.

#### Parameters

- `cwd` {string} - the project's root path
- `opts` {{}}
  - `opts.commitizenAdaptor` {string|null} (optional, default `null`)
  - `opts.commitizenInGlobal` {boolean} (optional, default `true`)
  - `opts.changelogPresetPkgName` {string}
    the custom changelog preset package's name should be installed
    like `@scoped/conventional-changelog-foo` (optional, default `''`)
  - `opts.changelogPreset` {string}
    [conventional-changelog](https://github.com/conventional-changelog)'s preset
    like `@scoped/foo` (optional, default `'angular'`)
  - `opts.registry` {string} the npm's registry (optional, default `''`)
  - `opts.commitlintPreset` {string}
    the [commitlint](https://github.com/marionebl/commitlint)'s preset config (optional, default `'@commitlint/config-conventional'`)
  - `opts.force` {boolean} - overwrite the existed config and devDependencies in `package.json`
  - `opts.stdio` {string}
    the [stdio](https://nodejs.org/dist/latest-v7.x/docs/api/child_process.html#child_process_options_stdio) of npm install process (optional, default `'inherit'`)

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

## License

MIT
