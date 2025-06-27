import path from 'path'

import { execa } from 'execa'
import { globSync } from 'glob'

import defaultOptions from './defaultOptions.js'

/**
 * @param pluginConfig
 * @param option
 */
export function getOption(pluginConfig, option) {
  return Object.hasOwn(pluginConfig, option) ? pluginConfig[option] : defaultOptions[option]
}

/**
 * @param version
 */
export async function normalizeVersion(version) {
  const { stdout } = await execa('python3', [
    '-W',
    'ignore',
    '-c',
    'try: import packaging.version\n' +
    'except: from pkg_resources import packaging\n' +
    `print(packaging.version.Version('${version}'))`
  ])

  return stdout
}

/**
 * @param setupPy
 * @param command
 * @param option
 * @param value
 */
export function setopt(setupPy, command, option, value) {
  return execa(
    'python3',
    [path.basename(setupPy), 'setopt', `--command=${command}`, `--option=${option}`, `--set-value=${value}`],
    { cwd: path.dirname(setupPy) }
  )
}

/**
 * @param setupPy
 */
export function getPyprojectTool(setupPy) {
  // FIXME: maybe extract tool from pyproject.toml instead
  const cwd = path.dirname(setupPy)
  const lockFiles = globSync(`${cwd}/*.lock`)
  if (lockFiles.length < 1) {
    return 'poetry'
  }

  // Get tool from first lock file name found, fallback on poetry 
  const lockFile = lockFiles[0]
  const tool = lockFile && path.basename(lockFile, '.lock') || 'poetry'

  return tool
}
