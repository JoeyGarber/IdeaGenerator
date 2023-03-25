import { useState } from 'react'
import { generateIdeas } from '../api/openAi'

export default function GiftGenerator () {
  const [budget, setBudget] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [interest, setInterest] = useState('')
  const [giftIdeas, setGiftIdeas] = useState('')

  const generateGifts = (budget: string, age: string, gender: string, interest: string) => {
    const model = "gpt-3.5-turbo"
    if (budget && age && gender && interest) {
      const content = `Give me a list of gift ideas without descriptions for gifts under ${budget} dollars for a(n) ${age} ${gender} who is interested in ${interest}`
      generateIdeas({ model, content })
      .then((resp: any) => {
        console.log(resp.data.choices[0].message.content)
        setGiftIdeas(resp.data.choices[0].message.content)
      })
      .catch((error) => console.log(error))
    }
  }

  const formatOutput = (ideas: string) => {
    // Remove all instances of numbers followed by a period and 0 or more spaces at the beginning of a line
    const cleanedIdeas = ideas.replaceAll(/\d+\.\s*/gm, '')
    // Split on line breaks, filter out empty entries
    const cleanedIdeasArray = cleanedIdeas.split(/\n/).filter((idea: string) => idea.length > 0)
    return (
      <ul>
        {cleanedIdeasArray.map((idea: string, idx: number) => {
          const amazonUrl = `https://amazon.com/s?k=${idea.replaceAll(' ', '+')}&sprefix=little+%2Caps%2C177&linkCode=ll2&tag=you0f552-20&linkId=d0a71f95525ab2c5fc77ecd8228711c5&language=en_US&ref_=as_li_ss_tl`
          return (
          <li key={idx}><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href={amazonUrl}>{idea}</a></li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-3xl font-bold underline m-1">Hi! How are you?</p>
      <input className="outline outline-1 m-1" type="text" placeholder="budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
      <input className="outline outline-1 m-1" type="text" placeholder="age" value={age} onChange={(e) => setAge(e.target.value)} />
      <input className="outline outline-1 m-1" type="text" placeholder="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
      <input className="outline outline-1 m-1" type="text" placeholder="interest" value={interest} onChange={(e) => setInterest(e.target.value)} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={() => generateGifts(budget, age, gender, interest)}>Click me!</button>
      {giftIdeas && formatOutput(giftIdeas)}
    </div>
  )
}