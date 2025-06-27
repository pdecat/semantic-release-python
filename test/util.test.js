import { afterEach, beforeEach, expect, test } from 'vitest'

import path from 'path'
import fs from 'fs'

import { getPyprojectTool, getOption, normalizeVersion } from '../lib/util.js'
import { genPackage } from './util.js'

const setupPy = '.tmp/util/pyproject.toml'
const setupPyDir = path.dirname(setupPy)
const packageName = 'semantic-release-pypi-util-test'

beforeEach(async () => {
  await genPackage(setupPy, packageName)
})

afterEach(async () => {
  fs.rmSync(setupPyDir, { recursive: true, force: true })
})

test('test getPyprojectTool without lock file', async () => {
  expect(getPyprojectTool(setupPyDir + '/pyproject.toml')).toBe('poetry')
})

test('test getPyprojectTool with poetry.lock file', async () => {
  fs.writeFileSync(setupPyDir + '/poetry.lock', "")
  expect(getPyprojectTool(setupPyDir + '/pyproject.toml')).toBe('poetry')
})

test('test getPyprojectTool with uv.lock file', async () => {
  fs.writeFileSync(setupPyDir + '/uv.lock', "")
  expect(getPyprojectTool(setupPyDir + '/pyproject.toml')).toBe('uv')
})

test('test getOption', async () => {
  expect(getOption({}, 'distDir')).toBe('dist')
  expect(getOption({}, 'setupPy')).toBe('./setup.py')
  expect(getOption({}, 'repoUrl')).toBe('https://upload.pypi.org/legacy/')

  expect(getOption({ distDir: 'mydist' }, 'distDir')).toBe('mydist')
  expect(getOption({}, 'foo')).toBe(undefined)
})

test('test normalizeVersion', async () => {
  await expect(normalizeVersion('1.0.1')).resolves.toBe('1.0.1')

  await expect(normalizeVersion('1.0.1a')).resolves.toBe('1.0.1a0')
  await expect(normalizeVersion('1.0.1alpha')).resolves.toBe('1.0.1a0')
  await expect(normalizeVersion('1.0.1-a')).resolves.toBe('1.0.1a0')
  await expect(normalizeVersion('1.0.1-a1')).resolves.toBe('1.0.1a1')
  await expect(normalizeVersion('1.0.1-alpha')).resolves.toBe('1.0.1a0')
  await expect(normalizeVersion('1.0.1-alpha1')).resolves.toBe('1.0.1a1')

  await expect(normalizeVersion('1.0.1-b')).resolves.toBe('1.0.1b0')
  await expect(normalizeVersion('1.0.1-beta')).resolves.toBe('1.0.1b0')
  await expect(normalizeVersion('1.0.1-rc')).resolves.toBe('1.0.1rc0')
  await expect(normalizeVersion('1.0.1-pre')).resolves.toBe('1.0.1rc0')
  await expect(normalizeVersion('1.0.1-post')).resolves.toBe('1.0.1.post0')
  await expect(normalizeVersion('1.0.1-dev')).resolves.toBe('1.0.1.dev0')

  await expect(normalizeVersion('1.0.1-next')).rejects.toThrow()
  await expect(normalizeVersion('1.0.1-develop')).rejects.toThrow()

  await expect(normalizeVersion('1 2 3')).rejects.toThrow()
})
