/* eslint-env jest */

import fsMock from 'file-mock'
import { extractSummary, handleStamper } from '../handle-stamper'
import { readFileSync } from 'fs'

jest.mock('git-last-commit', () => {
  return {
    getLastCommit: cb => {
      cb(null, {
        shortHash: 'b345b7d',
        hash: 'b345b7db12510508a960cb50f5cd5bc333ca6e13',
        subject: 'Initial commit',
        sanitizedSubject: 'Initial-commit',
        body: `This is a test body`,
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

afterEach(() => {
  fsMock.restore()
})

describe('handle-stamper', () => {
  it('should write template data to a file', async () => {
    const testFilePath = '/tmp/git-commit-stamper/test.md'

    fsMock.mock({
      [testFilePath]: '{{subject}}'
    })

    await handleStamper({
      logFile: testFilePath
    })

    const newLog = readFileSync(testFilePath, 'utf8')

    expect(newLog).toBe('Initial commit')
  })

  it('should write template data to an outFile param', async () => {
    const testFilePath = '/tmp/git-commit-stamper/test.md'
    const outFilePath = '/tmp/git-commit-stamper/out.md'

    fsMock.mock({
      [testFilePath]: '{{subject}}',
      [outFilePath]: ''
    })

    await handleStamper({
      logFile: testFilePath,
      outFile: outFilePath
    })

    const oldLog = readFileSync(testFilePath, 'utf8')
    const newLog = readFileSync(outFilePath, 'utf8')

    expect(oldLog).toBe('{{subject}}')
    expect(newLog).toBe('Initial commit')
  })

  it('should simulate the output', async () => {
    const testFilePath = '/tmp/git-commit-stamper/test.md'

    fsMock.mock({
      [testFilePath]: '{{subject}}'
    })

    const oldLog = console.log.bind(console)

    console.log = jest.fn()

    await handleStamper({
      logFile: testFilePath,
      simulate: true
    })

    expect(console.log).toBeCalledWith('Initial commit')
    console.log = oldLog
  })

  describe('extract summary', () => {
    it('should populate the summary', async () => {
      const commit = {
        body: `==summary==
This is a test summary
==end summary==

some content`,
        summary: ''
      }

      extractSummary(commit)

      expect(commit.summary).toBe(`
This is a test summary
`)
      expect(commit.body).toBe('some content')
    })

    it('should not populate the summary', async () => {
      const commit = {
        body: `==summary==
some content`,
        summary: ''
      }

      extractSummary(commit)

      expect(commit.summary).toBe('')
      expect(commit.body).toBe(`==summary==
some content`)
    })

    it('should not populate the summary 2', async () => {
      const commit = {
        body: `some content`,
        summary: ''
      }

      extractSummary(commit)

      expect(commit.summary).toBe('')
      expect(commit.body).toBe(`some content`)
    })
  })
})
