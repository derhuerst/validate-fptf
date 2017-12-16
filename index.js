'use strict'

const a = require('assert')
const is = require('@sindresorhus/is')

const validateItem = require('./lib/item')
const validateReference = require('./lib/reference')

const location = require('./location')
const station = require('./station')
const stop = require('./stop')
const line = require('./line')
const region = require('./region')
const route = require('./route')
const schedule = require('./schedule')
const operator = require('./operator')
const journey = require('./journey')

const validTypes = require('./lib/valid-types')

const validators = {
  location,
  station,
  stop,
  line,
  region,
  route,
  schedule,
  operator,
  journey
}

const recurse = (allowedTypes, any, name = 'item') => {
  const typesStr = allowedTypes.join(', ')

  if (is.object(any) && !is.array(any)) {
    validateItem(any, name)

    a.ok(allowedTypes.includes(any.type), name + '.type must be any of' + typesStr)

    const validator = validators[any.type]
    validator(recurse, any, name)
  } else {
    validateReference(any, name)
  }
}

const validate = any => recurse(validTypes, any, 'obj')

validate.recurse = recurse
module.exports = validate
