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
const detectIndent = require('detect-indent')

/**
 * make commitlint, husky and conventional-changelog getting along harmoniously together.
 * @name ccInit
 * @public
 * @param cwd {string} - the project's root path
 * @param opts {{}}
 * @param [opts.commitizenAdaptor=null] {string|null}
 * @param [opts.commitizenInGlobal=true] {boolean}
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
 * @return {boolean}
 */
module.exports = function ccInit(
  cwd,
  {
    changelogPresetPkgName = '',
    changelogPreset = 'angular',
    commitizenAdaptor = null,
    commitizenInGlobal = true,
    registry,
    commitlintPreset = '@commitlint/config-conventional',
    force,
    stdio = 'inherit'
  } = {}
) {
  function uptPkg(path, val) {
    let old = get(pkg, path)
    if (old && !force) {
      console.warn(`WARNING(pkg): ${path} in package.json has already existed, skipping.`)
      return
    }
    set(pkg, path, val)
  }

  function stringifyPkg() {
    return JSON.stringify(pkg, null, indent)
  }

  function install(packages = []) {
    packages = packages.filter(Boolean).map(name => {
      if (typeof name === 'string') {
        return { name }
      }
      return name
    })
    if (!force) {
      packages = packages.filter(({ name: packageName, removes }) => {
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

    let removeNames = []
    let packageNames = []
    packages.forEach(({ name, removes }) => {
      if (removes) {
        removeNames = removeNames.concat(removes)
      }
      if (name) {
        packageNames = packageNames.concat(name)
      }
    })

    if (removeNames && removeNames.length) {
      cp.spawnSync('npm', ['uninstall'].concat(removeNames).filter(Boolean), { stdio, cwd })
    }

    if (packageNames.length) {
      let rlt = cp.spawnSync(
        'npm',
        ['install']
          .concat(packageNames)
          .concat(['--save-dev', registry ? `--registry=${registry}` : ''])
          .filter(Boolean),
        { stdio, cwd }
      )
      pkg = JSON.parse(fs.readFileSync(pkgPath).toString())
      return rlt && rlt.status === 0
    }
  }

  const pkgPath = nps.join(cwd, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.error(`ERROR: "${pkgPath}" is not found.`)
    return false
  }

  let str = fs.readFileSync(pkgPath).toString()
  const indent = detectIndent(str).indent
  let pkg = JSON.parse(str)

  if (install(['conventional-changelog-cli', changelogPresetPkgName])) {
    uptPkg(
      'scripts.changelog',
      `conventional-changelog -p ${changelogPreset} -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
    )
    uptPkg('scripts.version', `npm run changelog`)
  }

  let pkgStr = stringifyPkg()

  uptPkg('husky.installType', 'append')
  fs.writeFileSync(pkgPath, stringifyPkg())

  if (install(['@commitlint/cli', { name: '@moyuyc/husky', removes: ['husky'] }, commitlintPreset])) {
    commitlintPreset &&
      uptPkg('commitlint.extends', [
        commitlintPreset.startsWith('@') ? commitlintPreset : './node_modules/' + commitlintPreset
      ])
    uptPkg('husky.hooks.commit-msg', 'commitlint -e $HUSKY_GIT_PARAMS')

    pkgStr = stringifyPkg()
  }

  if (typeof commitizenAdaptor === 'string') {
    if (!commitizenInGlobal && install(['commitizen'])) {
      uptPkg('scripts.commit', 'git-cz')
    } else {
      console.log('Hint: you should run `npm install commitizen --global`')
    }

    if (install([commitizenAdaptor])) {
      uptPkg('config.commitizen.path', './node_modules/' + commitizenAdaptor)
    }
    pkgStr = stringifyPkg()
  }

  fs.writeFileSync(pkgPath, pkgStr)
  return true
}
