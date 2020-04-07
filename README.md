# git-commit-stamper

[![NPM version](http://img.shields.io/npm/v/git-commit-stamper.svg?style=flat-square)](https://www.npmjs.com/package/git-commit-stamper)
[![CircleCI](https://circleci.com/gh/theogravity/git-commit-stamper.svg?style=svg)](https://circleci.com/gh/theogravity/git-commit-stamper)
![built with typescript](https://camo.githubusercontent.com/92e9f7b1209bab9e3e9cd8cdf62f072a624da461/68747470733a2f2f666c61742e62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Updates a log file with selected last git commit data using `handlebars` tags. 

This is useful for stamping in the commit subject / body / etc into your changelog entry.

<!-- TOC -->
- [Install](#install)
- [Usage](#usage)
  - [newlines](#newlines)
  - [Example](#example)
  - [Including a summary in your changelog](#including-a-summary-in-your-changelog)
  - [Skip stamping](#skip-stamping)
  - [Extended usage](#extended-usage)

<!-- TOC END -->

## Install

`npm i git-commit-stamper --save-dev`

In your `package.json`, add the following:

```json
{
  "scripts": {
    "git-commit-stamper": "git-commit-stamper"
  }
}
```

## Usage

The basic command is:

`$ npm run git-commit-stamper parse <logFile> [outFile]`

The parser gets the last git commit and produces the following object, which is used for template data
in `handlebars`:

```json
{
  "shortHash": "d2346fa",
  "hash": "d2346faac31de5e954ef5f6baf31babcd3e899f2",
  "subject": "initial commit",
  "sanitizedSubject": "initial-commit",
  "body": "this is the body of the commit message",
  "summary": "This is a summary of the change",
  "authoredOn": "1437988060",
  "committedOn": "1437988060",
  "author": {
    "name": "Ozan Seymen",
    "email": "oseymen@gmail.com"
  },
  "committer": {
    "name": "Ozan Seymen",
    "email": "oseymen@gmail.com"
  },
  "notes": "commit notes",
  "branch": "master",
  "tags": ['R1', 'R2']
}
```

### newlines

The following properties will have two newlines inserted at the end of their content:

- `subject`
- `sanitizedSubject`
- `body`
- `summary`
- `notes`

This allows for the following:

```text
{{subject}}{{{body}}}
```

If the content already has one newline, another will be added. If it has two, no changes will be made.

### Example

```text
# CHANGELOG.log

v2 - March 20, 2020

{{subject}}
```

`$ git-commit-stamper parse CHANGELOG.log`

Outputs:

```text
v2 - March 20, 2020

initial commit
```

### Including a summary in your changelog

The `body` content of the git commit might be too large for a changelog.

The template tag `summary` will be populated if in your commit body, you use the following syntax:

```text
This is my subject line

==summary==
This is a summary of the change
==end summary==

The rest of the commit body
```

The `body` tag will have the `==changelog==` markers and content removed (but they will remain in the
original git commit message).

```text
## {{subject}}{{summary}}
```

```text
## initial commit

This is a summary of the change
```

If `summary` is not empty, then you do not have to worry about adding newlines.

### Skip stamping

If you use this tool as part of your CI process, you can skip log stamping by including `[skip-changelog]`
as part of the git commit subject line.

### Extended usage

```bash
$ npm run git-commit-stamper

git-commit-stamper <command>

Commands:
  git-commit-stamper parse <logFile> [outFile]  Parses a log file with template tags and replaces the
                                                tags with the last git commit info.
  git-commit-stamper tags                       Shows the template data that would be fed into
                                                handlebars.

Options:
  --help     Show help                                                                        [boolean]
  --version  Show version number                                                              [boolean]
```

```bash
$ npm run git-commit-stamper parse --help

git-commit-stamper parse <logFile> [outFile]

Parses a log file with template tags and replaces the tags with the last git commit info.

Positionals:
  logFile  The log file to ingest.                                                  [string] [required]

Options:
  --help      Show help                                                                       [boolean]
  --version   Show version number                                                             [boolean]
  --outFile   Writes output to specified file instead of the original.                         [string]
  --simulate  Prints log output, does not write any data.                    [boolean] [default: false]                                                             [boolean]
```
