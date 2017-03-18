import React from 'react'
import { render } from 'react-dom'

import { Form, Field } from '../package/dist/index.js'

render(
  <div>
    <Form>
      {({ fields }) => {
        console.log(fields)
        return (
          <div>
            <Field name="button">
              {({ fields, name }) => (
                <button name={name} onClick={e => {
                  e.preventDefault()
                  const inc = fields.count + 1
                  fields.count = inc
                  fields.multiply = inc * inc
                }}>Inc</button>
              )}
            </Field>
            <Field name="count" value={0}>
              {({ fields, value, name }) => {
                return (
                  <div>
                    <input value={value} name={name}/>
                    <Field name="multiply" value={0}>
                      {({ fields, value, name }) => {
                        console.log(value)
                        return (
                          <input value={value} name={name}/>
                        )
                      }}
                    </Field>
                  </div>
                )
              }}
            </Field>
          </div>
        )
      }}
    </Form>
  </div>,
  document.getElementById('root')
)
