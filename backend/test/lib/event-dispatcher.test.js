'use strict'

const path = require('path')
const { test } = require('tap')
const awsMock = require('aws-sdk-mock')

awsMock.setSDK(path.resolve('./node_modules/aws-sdk'))

const received = {
  cwEvents: {}
}

awsMock.mock('CloudWatchEvents', 'putEvents', function(params, callback) {
  received.cwEvents.putEvents = params
  callback(null, { ...params })
})

test('createNewListEvent dispatches a CloudWatch custom event', async t => {
  const eventDispatcher = require('../../lib/event-dispatcher')

  const testList = {
    name: 'Test List',
    userId: 'user123'
  }

  await eventDispatcher.createNewListEvent(testList)

  const cwEntries = received.cwEvents.putEvents.Entries
  t.ok(cwEntries[0])
  t.same(JSON.parse(cwEntries[0].Detail), testList)
  t.equal(cwEntries[0].DetailType, 'LIST_CREATED_EVENT')

  t.end()
})