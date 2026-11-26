import { afterEach, expect, test, vi } from 'vitest'

import http from 'http'
import path from 'path'
import fs from 'fs-extra'

import { assertEnvVar, assertExitCode, assertPackage, verifySetupPy, verifyAuth } from '../lib/verify.js';
import { genPackage } from './util.js'

const setupPy = '.tmp/verify/setup.py'
const packageName = 'semantic-release-pypi-verify-test'

afterEach(async () => {
  fs.removeSync(path.dirname(setupPy))
})

test('test assertEnvVar', async () => {
  expect(assertEnvVar('PATH')).toBe(undefined)
  expect(() => assertEnvVar('FOO_BAZ_BAR')).toThrow()
})

test('test assertExitCode', async () => {
  await expect(assertExitCode('node', ['--version'], 0)).resolves.toBe(undefined)
  await expect(assertExitCode('node', ['--version'], 1)).rejects.toThrow()

  await expect(assertExitCode('node', ['--ver'], 9)).resolves.toBe(undefined)
  await expect(assertExitCode('node', ['--ver'], 0)).rejects.toThrow()
})

test('test assertPackage', async () => {
  await expect(assertPackage('pip')).resolves.toBe(undefined)
  await expect(assertPackage('foo-bar-baz')).rejects.toThrow()
})

test('test verifySetupPy', async () => {
  const testfn = async (setupPyContent, resolves) => {
    await genPackage(setupPy, packageName, setupPyContent)
    const promise = verifySetupPy(setupPy, console)

    if (resolves === false) {
      return expect(promise).rejects.toThrow()
    }

    return expect(promise).resolves.toBeUndefined()
  }

  await testfn(`from setuptools import setup\nsetup()`, true)
  await testfn(`from setuptools import setup\nsetup(version='1.0.0', description="test")`, false)
  await testfn(`# under the terms of the GNU General Public License version 3, or`, true)
  await testfn(`from setuptools import setup\nv='1.0.0'\nsetup(version=v, description="test")`, false)
})

test('test verifyAuth', async () => {
  const repoUrl = 'https://test.pypi.org/legacy/'

  await expect(verifyAuth(repoUrl, '__token__', '12345')).rejects.toThrow()
  if (process.env.TESTPYPI_TOKEN) {
    await expect(verifyAuth(repoUrl, '__token__', process.env.TESTPYPI_TOKEN)).resolves.toBe(undefined)
  } else {
    console.warn('skipped verifyAuth because TESTPYPI_TOKEN is not set')
  }
})

test('verifyAuth sends the upload form and only accepts an answer other than 403', async () => {
  const goodAuth = `Basic ${Buffer.from('__token__:good').toString('base64')}`
  const bodies = []
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      bodies.push({ contentType: req.headers['content-type'], body })
      // Like PyPI: valid credentials still fail the empty upload, invalid ones are refused
      res.statusCode = req.headers.authorization === goodAuth ? 400 : 403
      res.end()
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const repoUrl = `http://127.0.0.1:${server.address().port}/legacy/`

  try {
    await expect(verifyAuth(repoUrl, '__token__', 'bad')).rejects.toThrow()
    await expect(verifyAuth(repoUrl, '__token__', 'good')).resolves.toBe(undefined)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }

  expect(bodies).toHaveLength(2)
  expect(bodies[0].contentType).toMatch(/^multipart\/form-data; boundary=/)
  expect(bodies[0].body).toMatch(/name=":action"\r\n\r\nfile_upload/)

  // The server is gone: the credentials could not be checked
  await expect(verifyAuth(repoUrl, '__token__', 'good')).rejects.toThrow()
})
