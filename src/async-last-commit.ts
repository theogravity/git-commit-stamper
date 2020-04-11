import { Commit } from 'git-last-commit'
import { getLastCommit } from 'git-last-commit/source'

export function getTheLastCommit (): Promise<Commit> {
  return new Promise((resolve, reject) => {
    getLastCommit(
      (err, commit) => {
        if (err) {
          return reject(err)
        }

        resolve(commit)
      },
      {
        dst: process.cwd()
      }
    )
  })
}
