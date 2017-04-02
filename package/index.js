import React, { PropTypes } from 'react'

const merge = (ownProps, newProps) => {
  const { fields, state } = ownProps

  Object.keys(fields).forEach(key => {
    if (key in newProps) {
      fields[key](newProps[key])
      state[key] = newProps[key]
    }
  })

  return {
    fields,
    state
  }
}

export class LocalContext extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      initialValues: {},
      fields: {},
      localState: {}
    }
  }

  setLocalState (state) {
    this.setState(merge(this.state, state))
  }

  getChildContext () {
    const _ = this

    return {
      setInitialLocalState ({ name, value, update }) {
        _.setState({
          initialValues: Object.assign(_.state.initialValues, {
            [name]: value
          }),
          fields: Object.assign(_.state.fields, {
            [name]: update
          }),
          state: Object.assign(_.state.localState, {
            [name]: value
          })
        })
      },
      setLocalState (state) {
        _.setLocalState(state)
      },
      getLocalState () {
        return _.state.localState
      },
      resetLocalState () {
        _.setLocalState(_.state.initialValues)
      }
    }
  }

  render () {
    return this.props.children({
      localState: this.state.localState,
      resetLocalState: () => {
        this.setLocalState(this.state.initialValues)
      }
    })
  }
}

LocalContext.childContextTypes = {
  setInitialLocalState: PropTypes.func,
  setLocalState: PropTypes.func,
  getLocalState: PropTypes.func,
  resetLocalState: PropTypes.func
}

export class LocalField extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      name: props.name || null,
      value: props.initialValue || ''
    }
  }

  componentWillMount () {
    if (this.state.name === null || this.state.value === null) return

    this.context.setInitialLocalState({
      name: this.state.name,
      value: this.state.value,
      update: this.update.bind(this)
    })
  }

  update (value) {
    this.setState({
      value
    })
  }

  validate (value) {
    return this.props.validate ? this.props.validate(value) : true
  }

  render () {
    const localState = this.context.getLocalState()

    const { setLocalState, resetLocalState } = this.context

    const props = {
      valid: this.props.validate ? this.props.validate(this.state.value, localState) : true,
      setLocalState,
      resetLocalState,
      localState,
      ...this.state
    }

    return this.props.children(props)
  }
}

LocalField.contextTypes = {
  setInitialLocalState: PropTypes.func,
  setLocalState: PropTypes.func,
  getLocalState: PropTypes.func,
  resetLocalState: PropTypes.func
}
