import { useState } from 'react'

export const Prompt = ({ onSubmit }) => {
  const [promptInput, setPromptInput] = useState('')

  return (
    <textarea
      onChange={(e) => setPromptInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onSubmit(promptInput)
          setPromptInput('')
        }
      }}
      rows={3}
      className='w-full p-2.5 text-sm text-gray-900 bg-slate-200 rounded-lg border border-gray-300'
      placeholder='Write yor prompt there...'
      value={promptInput}
    />
  )
}
