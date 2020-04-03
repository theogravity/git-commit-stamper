#!/usr/bin/env node

import yargs from 'yargs'
import { handleStamper } from '../handle-stamper'
import { handleTags } from '../handle-tags'
;(async () => {
  return yargs
    .wrap(yargs.terminalWidth())
    .command(
      'parse <logFile> [outFile]',
      'Parses a log file with template tags and replaces the tags with the last git commit info.',
      // @ts-ignore
      yargs => {
        yargs
          .positional('logFile', {
            type: 'string',
            describe: 'The log file to ingest.'
          })
          .options({
            outFile: {
              type: 'string',
              description:
                'Writes output to specified file instead of the original.'
            },
            simulate: {
              default: false,
              type: 'boolean',
              description: 'Prints log output, does not write any data.'
            }
          })
      },
      handleStamper
    )
    .command(
      'tags',
      'Shows the template data that would be fed into handlebars.',
      () => {},
      handleTags
    )
    .demandCommand(1, '').argv
})()
