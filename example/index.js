import React from 'react'
import { render } from 'react-dom'

import { createForm, createField, createFactory } from '../package/dist/index.js'

const Input = createFactory(({ value, valid, validateField, updateField, type }) => {
  console.log(valid)
  return (
    <input type={type} value={value} onChange={e => {
      updateField(e.target.value)
      validateField()
    }}/>
  )
})

const Email = createField({
  name: 'email',
  initialValue: 'eric@gmail.com'
})(({ value, updateField, ...props }) => {
  console.log(props)
  return (
    <input type='email' value={value} onChange={e => updateField(e.target.value)}/>
  )
})

const App = createForm(({ state, getPayload, resetForm }) => {
  return (
    <form onSubmit={e => {
      e.preventDefault()
      console.log('raw state', state)
      console.log('payload', getPayload())
      resetForm()
    }}>
      <Email className='test'/>

      <Input type='text' initialValue='Factory input' name='factory' validate={val => val !== ''}/>

      <button type='submit'>Submit</button>
    </form>
  )
})

render(<App />, document.getElementById('root'))
