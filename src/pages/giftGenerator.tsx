import { useState } from 'react'
import { generateIdeas } from '../api/openAi'

import Female from '../assets/Female.png'
import Male from '../assets/Male.png'
import UpToTwenty from '../assets/UpToTwenty.png'
import UpToForty from '../assets/UpToForty.png'
import UpToHundred from '../assets/UpToHundred.png'
import HundredOrMore from '../assets/HundredOrMore.png'

export default function GiftGenerator () {
  const [page, setPage] = useState(0)
  const [budget, setBudget] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [interest, setInterest] = useState('')
  const [giftIdeas, setGiftIdeas] = useState('')

  const generateGifts = (budget: string, age: string, gender: string, interest: string) => {
    const model = "gpt-3.5-turbo"
    if (budget && age && gender && interest) {
      const content = `Give me a list of gift ideas without descriptions for gifts ${budget} for a(n) ${age} ${gender} who is interested in ${interest}`
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
          const amazonUrl = `https://amazon.com/s?k=${idea.replaceAll(' ', '+')}&linkCode=ll2&tag=idealgifts09-20`
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
                  <h3 className="text-xl font-bold">Select Your Recipient's Gender</h3>
                  <img alt='woman icon' className="w-[12vw] border-2 border-pink-500 rounded-lg m-1" src={Female} onClick={() => {
                    setGender('female')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='man icon' className="w-[12vw] border-2 border-blue-500 rounded-lg m-1" src={Male} onClick={() => {
                    setGender('male')
                    setPage((prev) => prev + 1)
                  }} />
                </div>
      case 1:
        return  <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Select Your Budget</h3>
                  <img alt='Up To Twenty' className="w-[8vw] border-2 border-green-500 rounded-lg" src={UpToTwenty} onClick={() => {
                    setBudget('up to 20 dollars')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='Up to Forty' className="w-[8vw] border-2 border-green-500 rounded-lg" src={UpToForty} onClick={() => {
                    setBudget('up to 40 dollars')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='Up to One Hundred' className="w-[8vw] border-2 border-green-500 rounded-lg" src={UpToHundred} onClick={() => {
                    setBudget('up to 100 dollars')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='One Hundred or More' className="w-[8vw] border-2 border-green-500 rounded-lg" src={HundredOrMore} onClick={() => {
                    setBudget('one hundred dollars or more')
                    setPage((prev) => prev + 1)
                  }} />
                </div>
      case 2:
        return  <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Select Your Recipient's Age</h3>
                  <input autoFocus onFocus={(e) => e.currentTarget.select()} className="outline outline-1 m-1" type="text" pattern="\d*"  placeholder="age" value={age} onChange={(e) => setAge(e.target.value)}  />
                </div>
      case 3:
        return  <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Input Your Recipient's Interests</h3>
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
          {page > 1 && page < 4 &&
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={handleNext}>
            Next
            </button>
          }
        </div>
      {giftIdeas && formatOutput(giftIdeas)}
    </div>
  )
}