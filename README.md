<div align="center">
  <center>
    <a href="https://github.com/pdecat/semantic-release-python">
      <img width="148" height="148" alt="Semantic Release Python logo" src="https://gitlab.com/megabyte-labs/npm/plugin/semantic-release-python/-/raw/master/logo.png" />
    </a>
  </center>
</div>
<div align="center">
  <center><h1 align="center"><i></i>A semantic-release plugin for Python (with support for both setup.cfg/setup.py and pyproject.toml with e.g. Poetry and uv)<i></i></h1></center>
</div>

<div align="center">
  <a href="https://github.com/pdecat/semantic-release-python/blob/master/docs/CONTRIBUTING.md" title="Learn about contributing" target="_blank">
    <img alt="Contributing" src="https://img.shields.io/badge/Contributing-Guide-0074D9?logo=github-sponsors&logoColor=white&style=for-the-badge" />
  </a>
  <a href="https://github.com/pdecat/semantic-release-python" title="GitHub mirror" target="_blank">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-333333?logo=github&style=for-the-badge" />
  </a>
</div>
<br/>
<div align="center">
  <a href="https://www.npmjs.com/package/@pdecat/semantic-release-python" title="Version 2.6.0" target="_blank">
    <img alt="Version: 2.6.0" src="https://img.shields.io/badge/version-2.6.0-blue.svg?cacheSeconds=2592000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAACNJREFUCNdjIACY//+BEp9hhM3hAzYQwoBIAqEDYQrCZLwAAGlFKxU1nF9cAAAAAElFTkSuQmCC&style=flat-square" />
  </a>
  <a href="https://github.com/pdecat/semantic-release-python/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHpJREFUCNdjYOD/wMDAUP+PgYHxhzwDA/MB5gMM7AwMDxj4GBgKGGQYGCyAEEgbMDDwAAWAwmk8958xpIOI5zKH2RmOyhxmZjguAiKmgIgtQOIYmFgCIp4AlaQ9OczGkJYCJEAGgI0CGwo2HmwR2Eqw5SBnNIAdBHYaAJb6KLM15W/CAAAAAElFTkSuQmCC&style=flat-square" />
  </a>
  <a href="https://snyk.io/advisor/npm-package/@pdecat/semantic-release-python" title="Number of vulnerabilities from Snyk scan on semantic-release-python" target="_blank">
    [Snyk]
  </a>
</div>

> </br><h4 align="center">**A semantic-release plugin for Python (with support for both setup.cfg/setup.py and pyproject.toml with e.g. Poetry and uv)**</h4></br>  

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
  - [Developer Requirements](#developer-requirements)
- [This Repository (Shared Common)](#this-repository-shared-common)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Semantic Release Python** is a [semantic-release](https://semantic-release.gitbook.io/semantic-release/) plugin that brings support for managing the version update and publication of PyPi packages. It supports traditional Python projects with a `setup.cfg` file and also **`pyproject.toml` file with e.g. Poetry and uv**.

This plugin requires both Python 3 and a recent version of Node.js to be present. After installing the plugin, a few supporting Python packages will automatically be installed into a `virtualenv` located at `.venv`. Using a virtualenv helps to prevent incompatibilities with your current installed software. Before you run any configuration that contains, you must source the virtualenv by running `. venv/bin/activate` or install the dependencies in this project's `requirements.txt` through other means prior to utilizing the plugin.

## Requirements

If you are simply including this library in your project, all you need is a recent version of Node.js, **Node.js >= 18** is sometimes required and is the only version range we actively support. Albeit, it is highly probable that lower versions will work as well depending on the requirements that this project imports.

### Developer Requirements

The following versions of Node.js and Python are required for development:

- **Node.js >= 18**
- **Python >= 3.10**

Other versions may work, but only the above versions are supported. 

## License

Copyright © 2020-2021 [Megabyte LLC](https://megabyte.space). This project is [MIT](https://gitlab.com/megabyte-labs/npm/plugin/semantic-release-python/-/blob/master/LICENSE) licensed.
