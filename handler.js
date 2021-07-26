const qs = require("querystring")
const {
  getSuggestionsFromNotionDatabase,
  addSuggestionToNotionDatabase,
} = require("./notion")
const { composeListOfSuggestions } = require("./slackbot")

module.exports.suggestion = (event, context, callback) => {
  const query = qs.parse(event.body)
  console.log(query)
  const [option, ...suggestionText] = query.text.split(" ")
  console.log(option, suggestionText)
  switch (option) {
    case "list":
      handleListOfSuggestions(callback)
      break
    case "add":
      handleAddSuggestion(suggestionText.join(" "), callback)
      break
    default:
      handleDefault(event, callback)
  }
}

async function handleListOfSuggestions(callback) {
  const suggestions = await getSuggestionsFromNotionDatabase()
  const formattedSlackMessage = composeListOfSuggestions(suggestions)
  const response = {
    statusCode: 200,
    body: JSON.stringify(formattedSlackMessage),
    headers: {
      "Content-Type": "application/json",
    },
  }

  callback(null, response)
}

async function handleAddSuggestion(suggestionText, callback) {
  await addSuggestionToNotionDatabase(suggestionText)
  const response = {
    statusCode: 200,
    body: "Gracias por la sugerencia! ❤️",
  }

  callback(null, response)
}

function handleDefault(event, callback) {
  const response = {
    statusCode: 200,
    body: "No te he entendido, prueba a usar (/suggestion list) o (/suggestion add [texto])  🚀",
  }

  callback(null, response)
}
