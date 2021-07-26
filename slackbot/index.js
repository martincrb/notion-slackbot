exports.composeListOfSuggestions = function (suggestions) {
  const list = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Listado de sugerencias recibidas 🚀",
        emoji: true,
      },
    },
  ]
  for (let suggestion of suggestions) {
    list.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: suggestion.suggestion,
      },
    })
    list.push({
      type: "divider",
    })
  }
  const response = {
    response_type: "ephemeral",
    blocks: list,
  }
  return response
}
