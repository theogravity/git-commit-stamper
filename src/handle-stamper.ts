import git from 'git-last-commit'
import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import Handlebars from 'handlebars'
import { Arguments } from './interaces'

const asyncLastCommit = promisify(git.getLastCommit)
const asyncReadFile = promisify(readFile)
const asyncWriteFile = promisify(writeFile)

const CHANGELOG_BODY_REGEX = /==summary==([\S\s]*?)==end summary==/gm

export async function handleStamper (params: Arguments) {
  const commit = await asyncLastCommit()

  if (commit.subject.includes('[skip-changelog]')) {
    console.log('Skipping changelog stamping\n')
    return
  }

  extractSummary(commit)

  let logData: any = await asyncReadFile(params.logFile, 'utf8')

  const template = Handlebars.compile(logData)

  let newLog = template(commit)

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

  commit['summary'] = bodyMatches ? bodyMatches[1] : ''

  if (commit['summary']) {
    // remove the changelog section from the original body
    commit.body = commit.body.replace(bodyMatches[0], '').trim()
  }
}
