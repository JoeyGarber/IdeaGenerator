import { useState } from 'react'
import { generateIdeas } from '../api/openAi'

export default function GiftGenerator () {
  const [page, setPage] = useState(0)
  const [budget, setBudget] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
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

  const allParamsFilled = () => {
    return budget && age && gender && interest
  }

  const conditionalForm = () => {
    switch (page) {
      case 0:
        return  <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Budget</h3>
                  <input autoFocus onFocus={(e) => e.currentTarget.select()} className="outline outline-1 m-1" type="text" pattern="\d*"  placeholder="budget" value={budget} onChange={(e) => setBudget(e.target.value)}  />
                </div>
      case 1:
        return  <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Age</h3>
                  <input autoFocus onFocus={(e) => e.currentTarget.select()} className="outline outline-1 m-1" type="text" pattern="\d*"  placeholder="age" value={age} onChange={(e) => setAge(e.target.value)}  />
                </div>
      case 2:
        return  <div>
                  <h3 className="text-xl font-bold">Gender</h3>
                  <select className="p-1" name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="select option" disabled={true}>Select Option</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
      case 3:
        return  <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Interest</h3>
                  <input autoFocus onFocus={(e) => e.currentTarget.select()} className="outline outline-1 m-1" type="text" placeholder="interest" value={interest} onChange={(e) => setInterest(e.target.value)}  />
                </div>
      case 4:
        if (allParamsFilled()) {
          return <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={() => generateGifts(budget, age, gender, interest)}>Generate Ideas!</button>
        }
        return <p>You missed a field!</p>
    }
  }

  const handleNext = () => {
    setPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold underline m-1">Gift Generator</h1>
      {conditionalForm()}
        <div>
          {page > 0 &&
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={handlePrev}>
              Back
            </button>
          }
          {page < 4 &&
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={handleNext}>
            Next
            </button>
          }
        <div>
          <p>Budget: {budget ? 'Filled' : 'Need to fill'}</p>
          <p>Age: {age ? 'Filled' : 'Need to fill'}</p>
          <p>Gender: {gender ? 'Filled' : 'Need to fill'}</p>
          <p>Interest: {interest ? 'Filled' : 'Need to fill'}</p>
        </div>
        </div>
      {giftIdeas && formatOutput(giftIdeas)}
    </div>
  )
}