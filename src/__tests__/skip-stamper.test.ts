import fsMock from 'file-mock'
import { handleStamper } from '../handle-stamper'

jest.mock('git-last-commit', () => {
  return {
    getLastCommit: cb => {
      cb(null, {
        shortHash: 'b345b7d',
        hash: 'b345b7db12510508a960cb50f5cd5bc333ca6e13',
        subject: '[skip-changelog] Initial commit',
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
      })
    }
  }
})

describe('skip stamp', () => {
  it('should skip stamping if [skip-changelog] is in the subject', async () => {
    const testFilePath = '/tmp/git-commit-stamper/test.md'

    fsMock.mock({
      [testFilePath]: '{{subject}}'
    })

    console.log = jest.fn()

    await handleStamper({
      logFile: testFilePath,
      simulate: true
    })

    expect(console.log).toBeCalledWith('Skipping changelog stamping\n')
  })
})
