import React from 'react'
import { Provider, connect } from 'microstate'

export class Field extends React.PureComponent {
  constructor (props) {
    super(props)

    const {
      name,
      initialValue,
      valid,
      children
    } = this.props

    this.Comp = connect(
      (name ? ({
        [name]: {
          value: initialValue || '',
          valid: valid !== undefined ? valid : true
        }
      }) : {}),
      state => ({
        value: state[name].value,
        valid: state[name].valid
      }),
      (dispatch, state) => ({
        update: value => dispatch({
          [name]: {
            value,
            valid: true
          }
        }),
        validate: valid => dispatch({
          [name]: {
            value: state[name].value,
            valid
          }
        })
      })
    )(children)
  }

  render () {
    const { Comp } = this

    return <Comp />
  }
}

export const FormProvider = ({
  children
}) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}
