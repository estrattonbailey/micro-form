import React from 'react'
import { Provider } from 'microstate'
import withFormState from './withFormState.js'

const createForm = Component => {
  const Comp = withFormState(Component)
  return props => (
    <Provider>
      <Comp {...props} />
    </Provider>
  )
}

export default createForm
