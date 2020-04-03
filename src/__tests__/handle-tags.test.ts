/* eslint-env jest */

import { handleTags } from '../handle-tags'

const TEST_DATA = {
  shortHash: 'b345b7d',
  hash: 'b345b7db12510508a960cb50f5cd5bc333ca6e13',
  subject: 'Initial commit',
  sanitizedSubject: 'Initial-commit',
  body: 'Test body',
  authoredOn: '1585863352',
  committedOn: '1585863352',
  author: {
    name: 'Theo Gravity',
    email: 'theo@test.nu'
  },
  committer: {
    name: 'Theo Gravity',
    email: 'theo@test.nu'
  },
  notes: '',
  branch: 'master',
  tags: []
}

jest.mock('git-last-commit', () => {
  return {
    getLastCommit: cb => {
      cb(null, TEST_DATA)
    }
  }
})

describe('handle-tags', () => {
  it('should print out the data that would be used in the template', async () => {
    console.log = jest.fn()

    await handleTags()

    // @ts-ignore
    expect(console.log).toBeCalledWith(JSON.stringify(TEST_DATA, 0, 2))
  })
})
