import React from 'react'
import { render } from 'react-dom'

import { FormProvider, Field } from '../package/dist/index.js'

const Input = ({ name, label, value = '' }) => (
  <Field name={name} initialValue={value}>
    {({ value, valid, update, validate }) => {
      return (
        <div>
          <label>{label}</label>

          <input
            value={value}
            onChange={e => update(e.target.value)}
            onBlur={e => validate(
              /@/.test(e.target.value)
            )}/>

          {!valid && <span style={{ color: 'red' }}>Email must include an @ sign</span>}
        </div>
      )
    }}
  </Field>
)

render(
  <FormProvider>
    {( state ) => {
      return (
        <form>
          <Input name="email" label="Email"/>
        </form>
      )
    }}
  </FormProvider>,
  document.getElementById('root')
)
