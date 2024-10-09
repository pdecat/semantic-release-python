const defaultOptions = require('./defaultOptions')
const execa = require('execa')
const path = require('path')

/**
 * @param pluginConfig
 * @param option
 */
function getOption(pluginConfig, option) {
  return Object.hasOwn(pluginConfig, option) ? pluginConfig[option] : defaultOptions[option]
}

/**
 * @param version
 */
async function normalizeVersion(version) {
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
function setopt(setupPy, command, option, value) {
  return execa(
    'python3',
    [path.basename(setupPy), 'setopt', `--command=${command}`, `--option=${option}`, `--set-value=${value}`],
    { cwd: path.dirname(setupPy) }
  )
}

module.exports = {
  getOption,
  normalizeVersion,
  setopt
}
