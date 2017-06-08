import React from 'react'
import { Provider, connect } from 'microstate'

export class Field extends React.PureComponent {
  constructor (props) {
    super(props)

    const {
      name,
      initialValue,
      valid,
      validate = (() => true),
      children
    } = this.props

    this.Comp = connect(
      (name ? ({
        [name]: {
          value: initialValue !== undefined ? initialValue : '',
          valid: valid !== undefined ? valid : true,
          validate: () => validate(this.value)
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
            valid: state[name].valid,
            validate: state[name].validate
          }
        }),
        validate: valid => dispatch({
          [name]: {
            value: state[name].value,
            valid: valid ? valid(state[name].value) : validate(state[name].value),
            validate: state[name].validate
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
    reset: () => dispatch(initialState),
    validate: () => {
      Object.keys(state).map(key => {
        dispatch({
          [key]: {
            value: state[key].value,
            valid: state[key].validate(),
            validate: state[key].validate
          }
        })
      })
    }
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
