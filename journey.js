'use strict'

const is = require('@sindresorhus/is')
const a = require('assert')
const isCurrencyCode = require('is-currency-code')

const validateDate = require('./lib/date')
const validateMode = require('./lib/mode')
const validateItem = require('./lib/item')
const validateReference = require('./lib/reference')

const isField = (obj, f) => {
  return !is.null(obj[f]) && !is.undefined(obj[f])
}

const validateLegs = (valItem, _name = 'schedule.legs') => {
  const validateLeg = (leg, i) => {
    const name = _name + '[' + i + ']'

    a.ok(is.object(leg) && !is.array(leg), name + ' must be an object')

    valItem(['station', 'stop', 'location'], leg.origin, name + '.origin')

    valItem(['station', 'stop', 'location'], leg.destination, name + '.destination')

    validateDate(leg.departure, name + '.departure')
    validateDate(leg.arrival, name + '.arrival')

    if (isField(leg, 'departurePlatform')) {
      a.strictEqual(typeof leg.departurePlatform, 'string', name + '.departurePlatform must be a string')
      a.ok(leg.departurePlatform.length > 0, name + '.departurePlatform can\'t be empty')
    }
    if (isField(leg, 'arrivalPlatform')) {
      a.strictEqual(typeof leg.arrivalPlatform, 'string', name + '.arrivalPlatform must be a string')
      a.ok(leg.arrivalPlatform.length > 0, name + '.arrivalPlatform can\'t be empty')
    }

    valItem(['schedule'], leg.schedule, name + '.schedule')

    if (isField(leg, 'mode')) {
      validateMode(leg.mode, name + '.mode')
    }

    if (isField(leg, 'public')) {
      a.strictEqual(typeof leg.public, 'boolean', name + '.public must be a boolean')
    }

    valItem(['operator'], leg.operator, name + '.operator')
  }
  return validateLeg
}

const validateJourney = (valItem, journey, name = 'journey') => {
  validateItem(journey, name)

  a.strictEqual(journey.type, 'journey', name + '.type must be `journey`')

  validateReference(journey.id, name + '.id')

  a.ok(Array.isArray(journey.legs), name + '.legs must be an array')
  a.ok(journey.legs.length > 0, name + '.legs can\'t be empty')
  journey.legs.forEach(validateLegs(valItem, name + '.legs'))
  // todo: check if sorted correctly

  if (isField(journey, 'price')) {
    const p = journey.price
    a.ok(is.object(p) && !is.array(p), name + '.price must be an object')
    a.strictEqual(typeof p.amount, 'number', name + '.price.amount must be a number')
    a.strictEqual(typeof p.currency, 'string', name + '.price.currency must be a string')
    a.ok(isCurrencyCode(p.currency), name + '.price.currency must be a valid ISO 4217 currency code')
  }
}

module.exports = validateJourney
