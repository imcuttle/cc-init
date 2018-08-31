/**
 * @file cc-init
 * @author Cuttle Cong
 * @date 2018/8/31
 * @description
 */
const cp = require('child_process')
const nps = require('path')
const get = require('lodash.get')
const set = require('lodash.set')
const fs = require('fs')

/**
 * make commitlint, husky and conventional-changelog getting along harmoniously together.
 * @public
 * @param cwd {string} - the project's root path
 * @param opts {{}}
 * @param [opts.changelogPresetPkgName = ''] {string}
 *  the custom changelog preset package's name should be installed
 *  like `@scoped/conventional-changelog-foo`
 * @param [opts.changelogPreset = 'angular'] {string}
 *  [conventional-changelog](https://github.com/conventional-changelog)'s preset
 *  like `@scoped/foo`
 * @param [opts.registry = ''] {string} the npm's registry
 * @param [opts.commitlintPreset = '@commitlint/config-conventional'] {string}
 *  the [commitlint](https://github.com/marionebl/commitlint)'s preset config
 * @param [opts.force] {boolean} - overwrite the existed config and devDependencies in `package.json`
 * @param [opts.stdio = 'inherit'] {string}
 *  the [stdio](https://nodejs.org/dist/latest-v7.x/docs/api/child_process.html#child_process_options_stdio) of npm install process
 * @return {void}
 */
module.exports = function ccInit(
  cwd,
  {
    changelogPresetPkgName = '',
    changelogPreset = 'angular',
    registry,
    commitlintPreset = '@commitlint/config-conventional',
    force,
    stdio = 'inherit'
  } = {}
) {
  const pkgPath = nps.join(cwd, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.error(`ERROR: "${pkgPath}" is not found.`)
    return false
  }
  function uptPkg(path, val) {
    let old = get(pkg, path)
    if (old && !force) {
      console.warn(`WARNING(pkg): ${path} in package.json has already existed, skipping.`)
      return
    }
    set(pkg, path, val)
  }

  function stringifyPkg() {
    return JSON.stringify(pkg, null, 2)
  }

  function install(packages = []) {
    packages = packages.filter(Boolean)
    if (!force) {
      packages = packages.filter(packageName => {
        const inDevDep = !!(pkg.devDependencies && pkg.devDependencies[packageName])
        const inDep = !!(pkg.dependencies && pkg.dependencies[packageName])
        if (inDevDep) {
          console.warn(`WARNING(install): ${packageName} in devDependencies, skipping.`)
          return false
        }
        if (inDep) {
          console.warn(`WARNING(install): ${packageName} in dependencies, skipping.`)
          return false
        }
        return true
      })
    }

    if (!packages || !packages.length) {
      return true
    }

    let rlt = cp.spawnSync(
      'npm',
      ['install']
        .concat(packages)
        .concat(['--save-dev', registry ? `--registry=${registry}` : ''])
        .filter(Boolean),
      { stdio, cwd }
    )
    pkg = JSON.parse(fs.readFileSync(pkgPath).toString())
    return rlt && rlt.status === 0
  }

  let pkg = JSON.parse(fs.readFileSync(pkgPath).toString())

  if (install(['conventional-changelog-cli', changelogPresetPkgName])) {
    uptPkg(
      'scripts.changelog',
      `conventional-changelog -p ${changelogPreset} -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
    )
    uptPkg('scripts.version', `npm run changelog`)
  }

  let pkgStr = stringifyPkg()

  uptPkg('husky.installType', 'append')

  if (install(['@commitlint/cli', '@moyuyc/husky', commitlintPreset])) {
    commitlintPreset && uptPkg('commitlint.extends', [commitlintPreset])
    uptPkg('husky.hooks.commit-msg', 'commitlint -e $HUSKY_GIT_PARAMS')

    pkgStr = stringifyPkg()
  }

  return fs.writeFileSync(pkgPath, pkgStr)
}
