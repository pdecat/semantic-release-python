import { vi } from 'vitest'

import path from 'path'
import fs from 'fs-extra'
import got from 'got'
import { v4 as uuidv4 } from 'uuid'

import { setopt } from '../lib/util.js'

const defaultContent = `
from setuptools import setup
setup()
`

/**
 * @param setupPy
 * @param name
 * @param content
 */
export async function genPackage(setupPy, name, content = defaultContent) {
  const dir = path.dirname(setupPy)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(setupPy, content)

  const options = [['name', name]]

  if (setupPy === 'setup.py') {
    for (const [option, value] of options) {
      await setopt(setupPy, 'metadata', option, value)
    }
  }
}

/**
 * @param repoUrl
 * @param packageName
 * @param version
 */
export async function hasPackage(repoUrl, packageName, version) {
  const url = `${repoUrl}/pypi/${packageName}/${version}/json`
  try {
    await got.get(url)

    return true
  } catch {
    return false
  }
}

/**
 *
 * @param {string} setupPy path of setup.py
 * @param name
 * @returns {{config: object, context: object, packageName: string}}
 */
export async function genPluginArguments(setupPy, name = 'integration') {
  const packageName = `semantic-release-pypi-${name}-test-${uuidv4()}`

  const config = {
    repoUrl: 'https://test.pypi.org/legacy/',
    setupPy
  }

  const context = {
    logger: {
      log: vi.fn()
    },
    nextRelease: {
      version: '1.2.3'
    },
    stderr: process.stderr,
    stdout: process.stdout
  }

  await genPackage(setupPy, packageName)

  return { config, context, packageName }
}
