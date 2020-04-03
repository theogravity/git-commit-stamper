import { promisify } from 'util'
import git from 'git-last-commit'

const asyncLastCommit = promisify(git.getLastCommit)

export async function handleTags () {
  // @ts-ignore
  console.log(JSON.stringify(await asyncLastCommit(), 0, 2))
}
