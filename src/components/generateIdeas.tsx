import { useState } from 'react'
const { Configuration, OpenAIApi } = require('openai');

interface Props {
  model: string,
  content: string
}


const GenerateIdeas: React.FC<Props> = ({ model, content }) => {
  const [ ideas, setIdeas ] = useState('')

  async function generateIdeas() {
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY
    })
    const openai = new OpenAIApi(configuration)
  
    const response = openai.createCompletion({
      model,
      messages: [{
        role: 'user',
        content
      }],
      temperature: 0.7,
      max_tokens: 209,
      top_p: 1,
      frequency_penalty: 0.5
    })
    .then((resp: any) => setIdeas(resp))
  }

  return (
    <div>
      <p>{ideas}</p>
      <button type="button">Click me</button>
    </div>
  )
}

export default GenerateIdeas