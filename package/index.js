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
          value: initialValue !== undefined ? initialValue : '',
          valid: valid !== undefined ? valid : true
        }
      }) : {}),
      state => name ? ({
        value: state[name].value,
        valid: state[name].valid
      }) : { state },
      (dispatch, state) => name ? ({
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
      }) : ({
        update: value => dispatch(value)
      })
    )(children)
  }

  render () {
    const { Comp } = this

    return <Comp />
  }
}

const FormProvider = connect(
  null,
  state => ({
    state
  }),
  (dispatch, state, initialState) => ({
    update: _state => dispatch(_state),
    reset: () => dispatch(initialState)
  })
)(({ children, ...props }) => (
  children(props)
))

export const Form = ({
  children
}) => (
  <Provider>
    <FormProvider>
      {children}
    </FormProvider>
  </Provider>
)
