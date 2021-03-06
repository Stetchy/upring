'use strict'

const test = require('tap').test
const helper = require('./helper')

const getKey = helper.getKey
const bootTwo = helper.bootTwo

test('fire and forget - request same instance', { timeout: 5000 }, (t) => {
  t.plan(4)

  bootTwo(t, (i1, i2) => {
    let i1Key = getKey(i1)

    i1.add({ cmd: 'add' }, req => {
      t.equal(req.key, i1Key, 'key matches')
      t.equal(req.value, 42, 'other key matches')
    })

    i1.fire({
      key: i1Key,
      cmd: 'add',
      value: 42
    })
  })
})

test('fire and forget - request different instance', { timeout: 5000 }, (t) => {
  t.plan(4)

  bootTwo(t, (i1, i2) => {
    let i2Key = getKey(i2)

    i1.fire({
      key: i2Key,
      cmd: 'add',
      value: 42
    })

    i2.add({ cmd: 'add' }, req => {
      t.equal(req.key, i2Key, 'key matches')
      t.equal(req.value, 42, 'other key matches')
    })
  })
})

test('fire and forget - request different instance with callback', { timeout: 5000 }, (t) => {
  t.plan(5)

  bootTwo(t, (i1, i2) => {
    let i2Key = getKey(i2)

    i1.fire({
      key: i2Key,
      cmd: 'add',
      value: 42
    }, t.error)

    i2.add({ cmd: 'add' }, req => {
      t.equal(req.key, i2Key, 'key matches')
      t.equal(req.value, 42, 'other key matches')
    })
  })
})

test('fire and forget - reply should not send back messages', { timeout: 5000 }, (t) => {
  t.plan(5)

  bootTwo(t, (i1, i2) => {
    let i2Key = getKey(i2)

    i1.fire({
      key: i2Key,
      cmd: 'add',
      value: 42
    }, t.error)

    i2.add({ cmd: 'add' }, (req, reply) => {
      t.equal(req.key, i2Key, 'key matches')
      t.equal(req.value, 42, 'other key matches')
      reply(new Error('kaboom!'))
    })
  })
})
