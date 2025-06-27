import { afterEach, beforeEach, expect, test } from 'vitest'

import path from 'path'
import fs from 'fs-extra'

import { setReleaseVersion, sDistPackage, bDistPackage } from '../lib/prepare.js'
import { genPackage } from './util.js'

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
