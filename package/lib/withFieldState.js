import { connect } from 'microstate'
import { err, msgs } from './errors.js'

const withFieldState = ({
  name = err(msgs.name),
  initialValue,
  valid = true,
  validate = (() => true),
}) => Component => connect(
  state => ({
    name,
    value: state[name].value,
    valid: state[name].valid
  }),
  (dispatch, state) => ({
    updateField: value => dispatch(state => ({
      [name]: {
        name: name,
        value,
        valid: state[name].valid,
        validate: state[name].validate
      }
    })),
    validateField: valid => dispatch(state => ({
      [name]: {
        name: name,
        value: state[name].value,
        valid: valid ? valid(state[name].value) : state[name].validate(state[name].value),
        validate: state[name].validate
      }
    }))
  }),
  {
    [name]: {
      value: initialValue !== undefined ? initialValue : '',
      valid: valid !== undefined ? valid : true,
      validate
    }
  }
)(Component)

export default withFieldState
