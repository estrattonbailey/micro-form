import React from 'react'
import { render } from 'react-dom'

import { Form, Field } from '../package/dist/index.js'

render(
  <div>
    <Form>
      {({ state }) => {
        return (
          <div>
            <Field name="email" value="">
              {({ state, value, name, setState }) => {
                return (
                  <input name={name} value={value} onChange={e => {
                    setState({
                      [name]: e.target.value
                    })
                  }}/>
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
