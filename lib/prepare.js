import fs from 'fs'
import path from 'path'

import { execa } from 'execa'

import { getPyprojectTool, getOption, normalizeVersion, setopt } from './util.js'

/**
 * @param setupPy
 * @param version
 */
export async function setReleaseVersion(setupPy, version) {
  try {
    await setopt(setupPy, 'metadata', 'version', version)
  } catch (error) {
    throw new Error(`failed to set release version ${version}\n${error}`)
  }
}

/**
 * @param setupPy
 * @param distDir
 */
export async function sDistPackage(setupPy, distDir) {
  try {
    await execa('python3', [path.basename(setupPy), 'sdist', '--dist-dir', distDir], { cwd: path.dirname(setupPy) })
  } catch {
    throw new Error(`failed to build source archive`)
  }
}

/**
 * @param setupPy
 * @param distDir
 */
export async function bDistPackage(setupPy, distDir) {
  try {
    await execa('python3', [path.basename(setupPy), 'bdist_wheel', '--dist-dir', distDir], {
      cwd: path.dirname(setupPy)
    })
  } catch {
    throw new Error(`failed to build wheel`)
  }
}

/**
 * @param pluginConfig
 * @param nextRelease
 * @param logger
 */
async function prepareSetupCfg(pluginConfig, nextRelease, logger) {
  const setupPy = getOption(pluginConfig, 'setupPy')
  const distDir = getOption(pluginConfig, 'distDir')
  const pypiPublish = getOption(pluginConfig, 'pypiPublish')

  const version = await normalizeVersion(nextRelease.version)

  logger.log(`Setting version to ${version}`)
  await setReleaseVersion(setupPy, version)

  if (pypiPublish !== false) {
    logger.log(`Build source archive`)
    await sDistPackage(setupPy, distDir)
    logger.log(`Build wheel`)
    await bDistPackage(setupPy, distDir)
  }
}

/**
 * @param pluginConfig
 * @param nextRelease
 * @param logger
 */
async function preparePyproject(pluginConfig, nextRelease, logger) {
  const setupPy = getOption(pluginConfig, 'setupPy')

  const version = await normalizeVersion(nextRelease.version)
  const tool = getPyprojectTool(setupPy)

  logger.log(`Setting version to ${version}`)
  const dir = path.dirname(setupPy)
  try {
    const { stdout, stderr } = await execa(tool, ['version', nextRelease.version], { cwd: dir })
    logger.log(`${stdout}`)
    logger.log(`${stderr}`)
  } catch (error) {
    throw new Error(`Failed to run "${tool} version ${nextRelease.version} in ${dir}:
      ${error.stdout}
      ${error.stderr}"`)
  }

  if (tool === 'uv') {
    logger.log(`Updating ${tool}.lock`)
    try {
      const { stdout, stderr } = await execa(tool, ['lock'], {
        cwd: dir,
        env: { UV_FROZEN: undefined }
      })
      logger.log(`${stdout}`)
      logger.log(`${stderr}`)
    } catch (error) {
      throw new Error(`Failed to run "${tool} lock" in ${dir}:
      ${error.stdout}
      ${error.stderr}`)
    }
  }
}

/**
 * @param pluginConfig
 * @param root0
 * @param root0.nextRelease
 * @param root0.logger
 */
export async function prepare(pluginConfig, { nextRelease, logger }) {
  const setupPy = getOption(pluginConfig, 'setupPy');
  if (fs.existsSync(setupPy)) {
    if (path.basename(setupPy) === "setup.cfg") {
      await prepareSetupCfg(pluginConfig, nextRelease, logger)
    } else if (path.basename(setupPy) === "pyproject.toml") {
      await preparePyproject(pluginConfig, nextRelease, logger)
    }
  } else {
    const pypiPublish = getOption(pluginConfig, 'pypiPublish')
    if (pypiPublish !== false) {
      throw new Error(`Project must have either a setup.cfg or a pyproject.toml file`)
    }
  }
}
