import React from 'react'
import { render } from 'react-dom'

import { Form, Field } from '../package/dist/index.js'

const Input = ({ name, label, value = '' }) => (
  <Field name={name} initialValue={value} validate={val => /@/.test(val)}>
    {({ value, valid, update, validate }) => {
      return (
        <div>
          <label>{label}</label>

          <input
            value={value}
            onChange={e => update(e.target.value)}
            onBlur={e => validate()}/>

          {!valid && <span style={{ color: 'red' }}>Email must include an @ sign</span>}
        </div>
      )
    }}
  </Field>
)

render(
  <Form>
    {props => {
      return (
        <form>
          <Input name="email" label="Email"/>
          <Input name="name" label="Name"/>

          <button type="button" onClick={e => {
            e.preventDefault()
            props.reset()
          }}>Reset</button>
          <button type="button" disabled={!props.valid} onClick={e => {
            e.preventDefault()
            const valid = props.validate()
            if (valid) console.log('Success')
          }}>Submit</button>
        </form>
      )
    }}
  </Form>,
  document.getElementById('root')
)
