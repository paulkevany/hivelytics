const { getUser } = require('slic-tools/user-util')
const invitation = require('../../lib/invitation')
const { sendEmail } = require('slic-tools/email-util')

const log = require('slic-tools/log')

const stage = process.env.SLIC_STAGE
const nsDomain = process.env.SLIC_NS_DOMAIN

const tableName = 'checklists'
async function create({ email, listId, listName, userId }) {
  const baseLink = `https://${stage}.${nsDomain}/invitation/`

  log.info('baseLink is: ', baseLink)
  if (!nsDomain) {
    log.info('SLIC_NS_DOMAIN must be set')
  }

  const { email: sharerEmail } = await getUser(userId)

  const { createCode } = invitation(process.env.CODE_SECRET)
  const code = createCode({ listId, userId, email })
  const fullLink = baseLink + code

  const message = {
    to: email,
    subject: `Invitation to join ${listName}`,
    body: `${sharerEmail} has invited you to join ${listName} on SLIC Lists
To accept this invitation, click on the following link.
${fullLink}

Many thanks,
SLIC Lists
`
  }
  await sendEmail(message)
}

async function list({ listId, userId }) {
  return (await dynamoDocClient()
    .query({
      TableName: tableName,
      ProjectionExpression: 'collaborators',
      KeyConditionExpression: 'listId = :listId',
      ExpressionAttributeValues: {
        ':listId': listId
      }
    })
    .promise()).Items
}

module.exports = {
  create,
  list
}
