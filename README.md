# git-commit-stamper

Updates a log file with selected last git commit data using `handlebars` tags. 

This is useful for stamping in the commit subject / body / etc into your changelog entry.

<!-- TOC -->

<!-- TOC END -->

## Install

`npm i git-commit-stamper -g`

## Usage

The basic command is:

`$ git-commit-stamper parse <logFile> [outFile]`

The parser gets the last git commit and produces the following object, which is used for template data
in `handlebars`:

```json
{
  "shortHash": "d2346fa",
  "hash": "d2346faac31de5e954ef5f6baf31babcd3e899f2",
  "subject": "initial commit",
  "sanitizedSubject": "initial-commit",
  "body": "this is the body of the commit message",
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

### Extended usage

```bash
$ git-commit-stamper

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
$ git-commit-stamper parse --help

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
