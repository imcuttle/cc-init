# cc-init

<!--
[![build status](https://img.shields.io/travis/imcuttle/cc-init/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/cc-init)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/cc-init.svg?style=flat-square)](https://codecov.io/github/imcuttle/cc-init?branch=master)
-->

[![NPM version](https://img.shields.io/npm/v/cc-init.svg?style=flat-square)](https://www.npmjs.com/package/cc-init)
[![NPM Downloads](https://img.shields.io/npm/dm/cc-init.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/cc-init)

set commitlint & conventional-changelog quickily

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

### index

[index.js:32-117](https://github.com/imcuttle/cc-init/blob/a8c8943da9482576765e2f503cff907c0b7ac781/index.js#L32-L117 'Source code on GitHub')

make commitlint, husky and conventional-changelog getting along harmoniously together.

#### Parameters

- `cwd` {string} - the project's root path
- `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** {{}}
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

Returns **void**

## License

MIT
