import axios from 'axios'

const openAiUrl = 'https://api.openai.com/v1/chat/completions'

interface IProps {
  model: string,
  content: string
}

export const generateIdeas = ({ model, content }: IProps) => {
  console.log(process.env.REACT_APP_OPENAI_API_KEY)
  return axios.post(openAiUrl, {
    model,
    messages: [
      {
        role: "user",
        content
      }
    ],
    temperature: 0.7,
    max_tokens: 209,
    top_p: 1,
    frequency_penalty: 0.5
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
}