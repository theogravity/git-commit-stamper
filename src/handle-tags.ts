import { getTheLastCommit } from './async-last-commit'

export async function handleTags () {
  // @ts-ignore
  console.log(JSON.stringify(await getTheLastCommit(), 0, 2))
}
