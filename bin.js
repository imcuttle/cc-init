#!/usr/bin/env node
/**
 * @file cc-init
 * @author Cuttle Cong
 * @date 2018/8/31
 * @description
 */
const nps = require('path')
const init = require('./index')
const fs = require('fs')

const argv = require('minimist')(process.argv.slice(2), {
  default: {
    'cz-in-global': true
  },
  boolean: ['cz-in-global', 'force', 'f']
})

/**
 * ```bash
 * export CHANGELOG_PRESET=@baidu/befe
 * export CHANGELOG_PRESET_PKGNAME=@baidu/conventional-changelog-befe
 * export COMMITIZEN_ADAPATOR=@baidu/cz-conventional-changelog-befe
 * export NPM_REGISTRY=http://registry.npm.baidu-int.com
 * export COMMITLINT_PRESET=@baidu/commitlint-config-befe
 * # Preset the default values
 * cc-init
 * ```
 * @public
 * @name cli
 */
const opt = {
  help: !!argv.h || !!argv.help,
  changelogPreset: argv['changelog-preset'] || process.env.CHANGELOG_PRESET || 'angular',
  changelogPresetPkgName: argv['changelog-preset-pkg'] || process.env.CHANGELOG_PRESET_PKGNAME, // || '@baidu/conventional-changelog-befe',
  registry: argv['registry'] || process.env.NPM_REGISTRY, // 'http://registry.npm.baidu-int.com',
  commitlintPreset: argv['commitlint-preset'] || process.env.COMMITLINT_PRESET,
  commitizenAdaptor: argv['cz-adaptor'] || process.env.COMMITIZEN_ADAPATOR,
  force: !!argv.f || !!argv.force || false,
  commitizenInGlobal: !!argv['cz-in-global']
}

// console.log(opt)
// process.exit()

if (opt.help) {
  console.log(`
   Usage
      $ cc-init <...paths>
 
   Options
   
      --help, -h               Help me
      
      --changelog-preset-pkg   conventional-changelog preset package's name (will installed)
                            
      --changelog-preset       conventional-changelog preset name
                               [Default: angular]
                               
      --registry               Npm registry
                               
      --commitlint-preset      commitlint preset 
                               [Default: @commitlint/config-conventional]
      
      --cz-adaptor             commitizen adaptor, skip install commitizen when is unset
      
      --no-cz-in-global        Use commitizen in *local*
      
      --force, -f              Overwrite it
 
   Examples
      $ cc-init .
  `)
  process.exit()
}

if (argv._.length === 0) {
  argv._ = [process.cwd()]
}

argv._.forEach(cwd => {
  init(cwd, opt)
})
