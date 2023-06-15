import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { generateIdeas } from '../api/openAi'
import { invokeLambdaFunction } from '../lambdaFunctions'

import Female from '../assets/Female.png'
import Male from '../assets/Male.png'
import UpToTwenty from '../assets/UpToTwenty.png'
import UpToForty from '../assets/UpToForty.png'
import UpToHundred from '../assets/UpToHundred.png'
import HundredOrMore from '../assets/HundredOrMore.png'
import { pregeneratedInterests } from '../pregeneratedInterests'
import { submitJotform } from '../api/jotform'
import TiktokPixel from 'tiktok-pixel'
import { isDisabled } from '@testing-library/user-event/dist/utils'

Modal.setAppElement('#root')

TiktokPixel.init(process.env.REACT_APP_TIKTOK_PIXEL_ID ?? '', { debug: true })

export default function GiftGenerator () {
  const [page, setPage] = useState(0)
  const [budget, setBudget] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [interest, setInterest] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [giftIdeas, setGiftIdeas] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [smsModalIsOpen, setSmsModalIsOpen] = useState(false)
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false)

  const modalCustomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const openSmsModal = () => {
    setSmsModalIsOpen(true)
  }

  const closeSmsModal = () => {
    setSmsModalIsOpen(false)
  }

  const openEmailModal = () => {
    setEmailModalIsOpen(true)
  }

  const closeEmailModal = () => {
    setEmailModalIsOpen(false)
  }

  const gifs  = [
  <iframe src="https://giphy.com/embed/91bOJ10KUjjLjSD6DC" title="first" className="giphy-embed" allowFullScreen></iframe>,
  <iframe src="https://giphy.com/embed/trgynYVwIQHL5pp3xB" title="second" className="giphy-embed" allowFullScreen></iframe>,
  <iframe src="https://giphy.com/embed/CCgX0wBtVUmSZ0DrRT" title="third" className="giphy-embed" allowFullScreen></iframe>,
  <iframe src="https://giphy.com/embed/5Y2bU7FqLOuzK" title="forth" className="giphy-embed" allowFullScreen></iframe>,
  <iframe src="https://giphy.com/embed/9VrBXYVGAX0bAEzSAT" title="fifth" className="giphy-embed" allowFullScreen></iframe>,
  <iframe src="https://giphy.com/embed/xULW8ohR9OvNoohoEU" title="sixth" className="giphy-embed" allowFullScreen></iframe>,
  // Make sure to add a comma after gifs to not break it, but no comma on the last one
  <iframe src="https://giphy.com/embed/zy6cfH1ZelttK" title="seventh" className="giphy-embed" allowFullScreen></iframe>
  ]

  const generateGifts = () => {
    const model = "gpt-3.5-turbo"
    if (allParamsFilled()) {
      const content = `Give me a list of gift ideas without descriptions for gifts ${budget} for a(n) ${age} ${gender} who is interested in ${formatInterests(interests)}`
      generateIdeas({ model, content })
      .then((resp: any) => {
        setGiftIdeas(resp.data.choices[0].message.content)
      })
      .then(() => submitJotform(budget, age, gender, formatInterests(interests)))
      .then(() => setPage(5))
      .catch((error) => console.log(error))
    }
  }

  const formatInterests = (interests: string[]) => {
    return interests.join(' and ')
  }

  const resetTest = () => {
    setBudget('')
    setAge('')
    setGender('')
    setInterest('')
    setInterests([])
    setGiftIdeas('')
    setPage(0)
  }

  useEffect(() => {
    if (allParamsFilled()) {
      generateGifts()
      setBudget('')
      setAge('')
      setGender('')
      setInterest('')
      setInterests([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget, gender, age, interest])

  const formatOutput = (ideas: string, twilioService: boolean = false) => {
    // Remove all instances of numbers followed by a period and 0 or more spaces at the beginning of a line
    const cleanedIdeas = ideas.replaceAll(/\d+\.\s*/gm, '')
    // Split on line breaks, filter out empty entries
    const cleanedIdeasArray = cleanedIdeas.split(/\n/).filter((idea: string) => idea.length > 0)
    if (twilioService) {
      return (
        cleanedIdeasArray.map((idea: string, idx: number) => {
          const amazonUrl = `https://amazon.com/s?k=${idea.replaceAll(' ', '+')}&linkCode=ll2&tag=idealgifts09-20`
          return (
            {
              amazonUrl,
              idea
            }
          )
        })
      )
    }
    return (
      <ul className="flex flex-col flex-wrap items-center p-3">
        {cleanedIdeasArray.map((idea: string, idx: number) => {
          const amazonUrl = `https://amazon.com/s?k=${idea.replaceAll(' ', '+')}&linkCode=ll2&tag=idealgifts09-20`
          // Only edit inside of className if anything in this section. Tailwind for edits
          return (
          <li key={idx}><a className="text-blue-600 font-bold dark:text-blue-500 hover:underline m-2" href={amazonUrl} target="_blank" rel="noreferrer">{idea}</a></li>
          )
        })}
      </ul>
    )
  }

  const allParamsFilled = () => {
    return budget && age && gender && interests.length > 0
  }

  const setAgeAndIncrement = (age: string) => {
    setAge(age)
    setPage((prev) => prev + 1)
  }

  const addUniqueInterest = (interest: string) => {
    if (interests.findIndex((item: string) => interest.toLowerCase() === item.toLowerCase()) < 0 && interest !== '') {
      setInterests((prev: string[]) => [...prev, interest])
    }
  }

  const removeInterest = (interest: string) => {
    setInterests((prev: string[]) => prev.filter((int:string) => int !== interest))
  }

  const handleSubmitInterest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addUniqueInterest(interest)
    setInterest('')
  }

  const conditionalPregeneratedInterests = (age: string, gender: string) => {
    const clickable = (interestArray: string[]) => {
      return (
        <div className="flex flex-col">
          {interestArray.map((interest: string, index: number) => {
            if (interests.findIndex((item: string) => interest.toLowerCase() === item.toLowerCase()) > -1) {
              return (
                <p className="font-bold text-white" key={index} onClick={() => removeInterest(interest)}>{interest}</p>
              )
            }
            return (
              <p className="font-bold betterhover:hover:text-white" key={index} onClick={() => {addUniqueInterest(interest)}}>{interest}</p>
            )
          })}
        </div>
      )
    }

    if (age && gender) {
      switch (age + ' ' + gender) {
        case('toddler age male'): {
          return clickable(pregeneratedInterests.toddlerMale)
        }
        case('toddler age female'): {
          return clickable(pregeneratedInterests.toddlerFemale)
        }
        case('elementary school age male'): {
          return clickable(pregeneratedInterests.elementaryMale)
        }
        case('elementary school age female'): {
          return clickable(pregeneratedInterests.elementaryFemale)
        }
        case('middle school age male'): {
          return clickable(pregeneratedInterests.middleSchoolMale)
        }
        case('middle school age female'): {
          return clickable(pregeneratedInterests.middleSchoolFemale)
        }
        case('teenage male'): {
          return clickable(pregeneratedInterests.teenageMale)
        }
        case('teenage female'): {
          return clickable(pregeneratedInterests.teenageFemale)       
        }
        case('mid twenties male'): {
          return clickable(pregeneratedInterests.twentiesMale)
        }
        case('mid twenties female'): {
          return clickable(pregeneratedInterests.twentiesFemale)
        }
        case('mid thirties male'): {
          return clickable(pregeneratedInterests.thirtiesMale)
        }
        case('mid thirties female'): {
          return clickable(pregeneratedInterests.thirtiesFemale)
        }
        case('mid forties male'): {
          return clickable(pregeneratedInterests.fortiesMale)
        }
        case('mid forties female'): {
          return clickable(pregeneratedInterests.fortiesFemale)
        }
        case('mid fifties male'): {
          return clickable(pregeneratedInterests.fiftiesMale)
        }
        case('mid fifties female'): {
          return clickable(pregeneratedInterests.fiftiesFemale)
        }
        case('sixty years old or older male'): {
          return clickable(pregeneratedInterests.sixtiesMale)
        }
        case('sixty years old or older female'): {
          return clickable(pregeneratedInterests.sixtiesMale)
        }
      }
    }
  }

  const conditionalForm = () => {
    const ageButtonClass = "flex justify-center bg-white border-2 border-blue-500 w-60 min-w-[100px] font-bold rounded-lg text-black p-3 m-1"
    const budgetButtonClass = "w-32 sm:w-36 border-2 border-green-500 rounded-lg m-1 bg-white"
    const genderButtonClass = "flex flex-col items-center w-[40vw] sm:w-60 min-w-[150px] border-2 rounded-lg m-1 bg-white"
    const headingClass = "text-xl font-bold mb-2"

    switch (page) {
      case 0:
        return  <div className="flex flex-col items-center">
                  <h3 className={headingClass}>Step 1: Who is getting the gift?</h3>
                  <div className={`${genderButtonClass} border-pink-500`}>
                    <img alt='woman icon'  src={Female} onClick={() => {
                      setGender('female')
                      setPage((prev) => prev + 1)
                    }} />
                    <p className="text-lg font-bold">Female</p>
                  </div>
                  <div className={`${genderButtonClass} border-blue-500`}>
                    <img alt='man icon' src={Male} onClick={() => {
                      setGender('male')
                      setPage((prev) => prev + 1)
                    }} />
                    <p className="text-lg font-bold">Male</p>
                  </div>
                </div>
      case 1:
        return  <div className="flex flex-col items-center">
                  <h3 className={headingClass}>Step 2: How old are they?</h3>
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('toddler age')}><p>Toddler</p></div>
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('elementary school age')}><p>Elementary School</p></div>           
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('middle school age')}><p>Middle School</p></div>           
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('teenage')}><p>Teen</p></div>           
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('mid twenties')}><p>20s</p></div>           
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('mid thirties')}><p>30s</p></div>
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('mid forties')}><p>40s</p></div>
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('mid fifties')}><p>50s</p></div>
                  <div className={ageButtonClass} onClick={() => setAgeAndIncrement('sixty years old or older')}><p>60s or older</p></div>
                </div>
      case 2:
        return  <div className="flex flex-col items-center">
                  <h3 className={headingClass}>Step 3: What are they into?</h3>
                  <div>
                    <h2 className="text-xl font-bold m-0">Selected Interests: </h2>
                    <h4 className="font-thin p-0 mb-2">Click an interest to add/remove</h4>

                      <ul className="list-disc font-bold text-xl">
                      {interests.map((interest:string, index:number) => <li className="hover:text-slate-600" onClick={() => removeInterest(interest)} key={index}>{interest}</li>)}
                      </ul>
                  </div>
                  <form onSubmit={(e) => handleSubmitInterest(e)}>
                    <input autoFocus onFocus={(e) => e.currentTarget.select()} className="outline outline-1 m-1" type="text" placeholder="type an interest here" value={interest} onChange={(e) => setInterest(e.target.value)}  />
                    <button type="submit" className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded m-3 border-2 border-blue-500">Add Interest</button>
                  </form>
                  <h2 className="font-thin m-0">Click "Next" when you're finished</h2>
                </div>
      case 3:
        return  <div className="flex flex-col items-center">
                  <h3 className={headingClass}>Step 4: How much do you love them?</h3>
                  <img alt='Up To Twenty' className={budgetButtonClass} src={UpToTwenty} onClick={() => {
                    setBudget('up to 20 dollars')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='Up to Forty' className={budgetButtonClass} src={UpToForty} onClick={() => {
                    setBudget('up to 40 dollars')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='Up to One Hundred' className={budgetButtonClass} src={UpToHundred} onClick={() => {
                    setBudget('up to 100 dollars')
                    setPage((prev) => prev + 1)
                  }} />
                  <img alt='One Hundred or More' className={budgetButtonClass} src={HundredOrMore} onClick={() => {
                    setBudget('one hundred dollars or more')
                    setPage((prev) => prev + 1)
                  }} />
                </div>
      case 4:
        return (
            <>
              {gifs[Math.floor(Math.random() * gifs.length)]}
              <p>Loading gift ideas... For a chance to win a $10 giftcard, email yourself the generated list. 1 random winner per month!</p>
            </>
        )
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
      <div className="flex justify-center w-screen bg-white pb-1 mb-4">
        <h1 className="text-3xl font-bold m-4" onClick={resetTest}>The Gift Idea Generator</h1>
      </div>
      <div className="flex justify-center w-screen bg-white pb-1 mb-1">
        <h1 className="content-center shrink h-1 text-2xl font-italic m-0 pt-0 pb-7">GiftG.co - That's a good idea</h1>
      </div>
      {conditionalForm()}
        <div>
          {page > 0 && page < 4 &&
            <button className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded m-3 border-2 border-black" onClick={handlePrev}>
              Back
            </button>
          }
          {page === 2 &&
            <button className={`${interests.length > 0 ? 'bg-white hover:bg-blue-700' : 'bg-slate-500'} text-black font-bold py-2 px-4 rounded m-3 border-2 border-black`} disabled={interests.length === 0} onClick={handleNext}>
            Next
            </button>
          }
        </div>
        {page === 2 && conditionalPregeneratedInterests(age, gender)}
      {giftIdeas && 
      <>
      <h1 className="text-lg font-bold">Step 4:</h1>
      <h3 className="text-lg">Click an idea to see the top options!</h3>
      <input type="submit" value="Click to text yourself this list!" onClick={openSmsModal} className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded m-3 border-2 border-black" />
      {formatOutput(giftIdeas)}
      <h6 className="text-md">As an Amazon Associate I earn from qualifying purchases. Happy gifting!</h6>
      <input type="submit" value="Click to email yourself this list!" onClick={openEmailModal} className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded m-3 border-2 border-black" />
      <Modal
        isOpen={smsModalIsOpen}
        onRequestClose={closeSmsModal}
        style={modalCustomStyles}
      >
        <div className="flex flex-col">
          <div className="flex justify-end">
            <input type="submit" className="right-0" value="X" onClick={closeSmsModal} />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold m-0">Type your phone number in the box</h2>
            <p className="m-2">We will never text you random stuff, just the gift list, pinky promise.</p>
            <p className="m-1"><strong>Number should be 10 digits, no spaces or other characters</strong></p>
            <input type="tel" className="border-2 border-black" placeholder="e.g. 4086570749" value={tel} onChange={(e) => setTel(e.target.value)} />
            <input type="submit" onClick={() =>
            invokeLambdaFunction('sendResultsSms', {
                to: "+1" + tel,
                msg: formatOutput(giftIdeas, true)
                }
              )
              .then(() => setTel(''))
              .then(() => closeSmsModal())
              } className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded m-3 border-2 border-black"/>
            </div>
          </div>
      </Modal>
      {/* EMAIL MODAL */}
      <Modal
        isOpen={emailModalIsOpen}
        onRequestClose={closeEmailModal}
        style={modalCustomStyles}
      >
        <div className="flex flex-col">
          <div className="flex justify-end">
            <input type="submit" className="right-0" value="X" onClick={closeEmailModal} />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold m-0">Type your email address in the box</h2>
            <p className="m-2">We will never email you random stuff, just the gift list, pinky promise.</p>
            <input type="email" className="border-2 border-black" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="submit" onClick={() =>
            invokeLambdaFunction('sendResults', {
                to: email,
                from: 'ben@giftg.co',
                template_id: process.env.REACT_APP_SENDGRID_RESULTS_TEMPLATE_ID,
                dynamic_template_data: {
                    results: formatOutput(giftIdeas, true)
                  }
                }
              )
              .then(() => setEmail(''))
              .then(() => closeEmailModal())
              } className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded m-3 border-2 border-black"/>
            </div>
          </div>
      </Modal>
      </>
      }
    </div>
  )
}
