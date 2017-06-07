import React from 'react'
import { render } from 'react-dom'

import { FormProvider, Field } from '../package/dist/index.js'

render(
  <FormProvider>
    {( state ) => {
      return (
        <form>
          <Field name="email" value="">
            {({ value, valid, update, validate }) => {
              return (
                <div>
                  <label>Email</label>

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
        </form>
      )
    }}
  </FormProvider>,
  document.getElementById('root')
)
