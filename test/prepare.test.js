import { afterEach, beforeEach, expect, test } from 'vitest'

import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs-extra'

import { prepare, setReleaseVersion, sDistPackage, bDistPackage } from '../lib/prepare.js'
import { genPackage } from './util.js'

const hasUv = spawnSync('uv', ['--version']).status === 0

const version = '1.0.1'
const setupPy = '.tmp/prepare/setup.py'
const distDir = 'dist'
const setupPyDir = path.dirname(setupPy)
const packageName = 'semantic-release-pypi-prepare-test'

beforeEach(async () => {
  await genPackage(setupPy, packageName)
})

afterEach(async () => {
  fs.removeSync(setupPyDir)
})

test('test prepare functions', async () => {
  await expect(setReleaseVersion(setupPy, version)).resolves.toBe(undefined)
  await expect(sDistPackage(setupPy, distDir)).resolves.toBe(undefined)
  await expect(bDistPackage(setupPy, distDir)).resolves.toBe(undefined)
})

test.skipIf(!hasUv)('prepare a uv project without syncing its environment', async () => {
  const dir = '.tmp/prepare-uv'
  const pyproject = `${dir}/pyproject.toml`
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    pyproject,
    ['[project]', 'name = "semantic-release-uv-prepare-test"', 'version = "1.0.0"', 'requires-python = ">=3.9"', 'dependencies = []', ''].join('\n')
  )
  // The lock file is what tells the plugin the project is managed by uv
  expect(spawnSync('uv', ['lock'], { cwd: dir }).status).toBe(0)

  try {
    await prepare({ setupPy: pyproject, pypiPublish: false }, { nextRelease: { version }, logger: { log: () => {} } })

    expect(fs.readFileSync(pyproject, 'utf8')).toContain(`version = "${version}"`)
    expect(fs.readFileSync(`${dir}/uv.lock`, 'utf8')).toContain(`version = "${version}"`)
    // A release only needs pyproject.toml and uv.lock updated, not the dependencies installed
    expect(fs.existsSync(`${dir}/.venv`)).toBe(false)
  } finally {
    fs.removeSync(dir)
  }
})
