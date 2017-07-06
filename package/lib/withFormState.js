import { connect } from 'microstate'

const keys = o => Object.keys(o)

const withFormState = Component => connect(
  state => ({
    state,
    valid: keys(state).filter(key => {
      return state[key].valid === false
    }).length < 1,
    getPayload: () => keys(state).reduce((payload, k) => {
      payload[k] = state[k].value
      return payload
    }, {})
  }),
  (dispatch, state, initialState) => ({
    resetForm: () => dispatch(initialState),
    validateForm: cb => {
      return keys(state).reduce((res, key) => {
        const valid = state[key].validate(state[key].value)

        if (!valid) {
          res = false
        }

        dispatch(state => ({
          [key]: {
            value: state[key].value,
            valid: valid,
            validate: state[key].validate
          }
        }))

        return res
      }, true)
    }
  })
)(Component)

export default withFormState
