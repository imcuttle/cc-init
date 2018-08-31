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
const argv = require('minimist')(process.argv.slice(2))

const opt = {
  help: !!argv.h || !!argv.help,
  changelogPreset: argv['changelog-preset'] || process.env.CHANGELOG_PRESET || 'angular',
  changelogPresetPkgName: argv['changelog-preset-pkg'] || process.env.CHANGELOG_PRESET_PKGNAME, // || '@baidu/conventional-changelog-befe',
  registry: argv['registry'] || process.env.NPM_REGISTRY, // 'http://registry.npm.baidu-int.com',
  commitlintPreset: argv['commitlint-preset'] || process.env.COMMITLINT_PRESET || '@commitlint/config-conventional', // || '@baidu/commitlint-config-befe',
  force: !!argv.f || !!argv.force || false
}

if (opt.help) {
  console.log(`
   Usage
      $ cc-init <...paths>
 
   Options
   
      --help, -h               help me
      
      --changelog-preset-pkg   conventional-changelog preset package's name (will installed)
                            
      --changelog-preset       conventional-changelog preset name
                               [Default: angular]
                               
      --registry               npm registry
                               
      --commitlint-preset      [Default: @commitlint/config-conventional]
      
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
