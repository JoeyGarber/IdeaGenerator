import GenerateIdeas from '../components/generateIdeas'

export default function Homepage () {
  return (
    <div>
      <p className="text-3xl font-bold underline">Hi! How are you?</p>
      <GenerateIdeas
      model='model'
      content='content'
       />
    </div>
  )
}