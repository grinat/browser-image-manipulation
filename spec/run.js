const Jasmine = require('jasmine')
const JasmineConsoleReporter = require('jasmine-console-reporter')

const jasmine = new Jasmine()
jasmine.loadConfigFile('spec/support/jasmine.json')

const reporter = new JasmineConsoleReporter()
jasmine.env.clearReporters()
jasmine.addReporter(reporter)

jasmine.execute()
