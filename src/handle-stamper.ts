import git from 'git-last-commit'
import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import Handlebars from 'handlebars'
import { Arguments } from './interaces'

const asyncLastCommit = promisify(git.getLastCommit)
const asyncReadFile = promisify(readFile)
const asyncWriteFile = promisify(writeFile)

const CHANGELOG_BODY_REGEX = /==summary==([\S\s]*?)==end summary==/gm

const FIELDS_TO_ADD_NEWLINES = [
  'subject',
  'sanitizedSubject',
  'body',
  'summary',
  'note'
]

export function addNewlinesToCommitData (commitData) {
  FIELDS_TO_ADD_NEWLINES.forEach(field => {
    let content = commitData[field]

    if (content) {
      content = commitData[field].trimEnd()
      content = content + '\n\n'
      commitData[field] = content
    }
  })
}

export function parseAndCompileChangelog (commitData, changelog) {
  const template = Handlebars.compile(changelog)

  return template(commitData)
}

export async function handleStamper (params: Arguments) {
  const commit = await asyncLastCommit()

  if (commit.subject.includes('[skip-changelog]')) {
    console.log('Skipping changelog stamping\n')
    return
  }

  extractSummary(commit)
  addNewlinesToCommitData(commit)

  let logData: any = await asyncReadFile(params.logFile, 'utf8')

  let newLog = parseAndCompileChangelog(commit, logData)

  if (params.simulate) {
    console.log(newLog)
    return
  }

  const outPath = params.outFile || params.logFile

  await asyncWriteFile(outPath, newLog, 'utf8')

  console.log('Changelog file updated\n')
}

export function extractSummary (commit) {
  const bodyMatches = CHANGELOG_BODY_REGEX.exec(commit.body)

  commit['summary'] = bodyMatches ? bodyMatches[1].trim() : ''

  if (commit['summary']) {
    // remove the changelog section from the original body
    commit.body = commit.body.replace(bodyMatches[0], '').trim()
  }
}
