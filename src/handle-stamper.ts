import git from 'git-last-commit'
import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import Handlebars from 'handlebars'
import { Arguments } from './interaces'

const asyncLastCommit = promisify(git.getLastCommit)
const asyncReadFile = promisify(readFile)
const asyncWriteFile = promisify(writeFile)

export async function handleStamper (params: Arguments) {
  let logData: any = await asyncReadFile(params.logFile, 'utf8')

  const commit = await asyncLastCommit()

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
