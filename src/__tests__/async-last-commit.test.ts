/* eslint-env jest */

import { getTheLastCommit } from '../async-last-commit'

describe('async-last-commit', () => {
  it('should return last commit data', async () => {
    const commit = await getTheLastCommit()
    expect(commit.branch).toBeDefined()
  })
})
