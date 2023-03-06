import axios from 'axios'

function sendChatMessage(message: string): Promise<string> {
  if (!message) {
    return Promise.reject('Empty message')
  }

  return axios
    .post<{ choices: { text: string }[] }>(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: message + '\n',
        max_tokens: 60,
        temperature: 0.5,
        n: 1,
        stop: '\n',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer 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',
        },
      }
    )
    .then(response => {
      const botMessage = response.data.choices[0].text.trim()
      return botMessage
    })
    .catch(error => {
      console.log(error)
      return Promise.reject('Error sending message')
    })
}

export { sendChatMessage }
