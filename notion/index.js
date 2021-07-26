const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_KEY })

const notionDatabaseId = process.env.NOTION_SUGGESTIONS_DB_ID

function getSuggestionValuesFromPage(page) {
  console.log(page.properties.Suggestion.title[0].text.content)
  return {
    id: page.id,
    suggestion: page.properties.Suggestion.title[0].text.content,
  }
}

exports.getSuggestionsFromNotionDatabase = async function () {
  const pages = []
  let cursor = undefined
  let next_cursor = undefined
  do {
    const { results, next_cursor } = await notion.databases.query({
      database_id: notionDatabaseId,
      start_cursor: cursor,
    })
    pages.push(...results)
    cursor = next_cursor
  } while (next_cursor != undefined)
  console.log(`${pages.length} suggestions successfully fetched.`)
  return pages.map(page => getSuggestionValuesFromPage(page))
}

exports.addSuggestionToNotionDatabase = async function (suggestionText) {
  await notion.pages.create({
    parent: { database_id: notionDatabaseId },
    properties: {
      Suggestion: {
        title: [{ type: "text", text: { content: suggestionText } }],
      },
    },
  })
  console.log(`New suggestion saved`)
}
