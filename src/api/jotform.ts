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
  return axios.post(`${jotformUrl}/form/${jotformFormId}/submissions?apiKey=${process.env.REACT_APP_JOTFORM_API_KEY}`, jotFormSubmission)
}