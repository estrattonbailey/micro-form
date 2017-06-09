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
          validate
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
        validate: valid => {
          dispatch({
            [name]: {
              value: state[name].value,
              valid: valid ? valid(state[name].value) : validate(state[name].value),
              validate: state[name].validate
            }
          })
        }
      }) : ({
        update: value => dispatch(value)
      })
    )(children)
  }

  render () {
    const { Comp, props } = this

    return <Comp {...props} />
  }
}

const FormProvider = connect(
  null,
  state => ({
    state,
    valid: Object.keys(state).filter(key => {
      return state[key].valid === false
    }).length < 1
  }),
  (dispatch, state, initialState) => ({
    update: _state => dispatch(_state),
    reset: () => dispatch(initialState),
    validate: cb => {
      return Object.keys(state).reduce((res, key) => {
        const valid = state[key].validate(state[key].value)

        if (!valid) {
          res = false
        }

        dispatch({
          [key]: {
            value: state[key].value,
            valid: valid,
            validate: state[key].validate
          }
        })

        return res
      }, true)
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
