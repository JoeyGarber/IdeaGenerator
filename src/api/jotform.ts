import axios from 'axios'

const jotformUrl = 'https://api.jotform.com'
const jotformFormId = '230787737739171'

export const submitJotform = (budget: string, age: string, gender: string, interest: string) => {
  const jotFormSubmission = {
    "5": interest,
    "6": gender,
    "7": age,
    "8": budget
  }
  console.log(process.env.REACT_APP_JOTFORM_API_KEY)
  return axios.post(`${jotformUrl}/form/${jotformFormId}/submissions`, jotFormSubmission, {
      params: {
        'apiKey': process.env.REACT_APP_JOTFORM_API_KEY
      }
    })
}