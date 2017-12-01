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

export class Form extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {},
      state: {},
      initialState: {}
    }
  }

  reset () {
    const { fields, initialState } = this.state

    Object.keys(fields).forEach(key => {
      console.log('name', key, 'initial', initialState[key])
      fields[key](initialState[key])
    })

    this.setState({
      state: initialState
    })
  }

  getChildContext () {
    const _ = this

    return {
      setInitialGlobalState ({ name, value, update }) {
        _.setState({
          fields: Object.assign(_.state.fields, {
            [name]: update
          }),
          state: Object.assign(_.state.state, {
            [name]: value
          }),
          initialState: Object.assign(_.state.initialState, {
            [name]: value
          })
        })
      },
      setGlobalState (state) {
        _.setState(merge(_.state, state))
      },
      getGlobalState () {
        return _.state.state
      }
    }
  }

  render () {
    console.log(this.state)
    return this.props.children({
      state: this.state.state
    })
  }
}

Form.childContextTypes = {
  setInitialGlobalState: PropTypes.func,
  setGlobalState: PropTypes.func,
  getGlobalState: PropTypes.func
}

export class Field extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      name: props.name,
      value: props.value || ''
    }
  }

  componentWillMount () {
    this.context.setInitialGlobalState({
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
    const globalState = this.context.getGlobalState()

    const props = {
      valid: this.props.validate ? this.props.validate(this.state.value, globalState) : true,
      setState: this.context.setGlobalState,
      state: globalState,
      ...this.state
    }

    return this.props.children(props)
  }
}

Field.contextTypes = {
  setInitialGlobalState: PropTypes.func,
  setGlobalState: PropTypes.func,
  getGlobalState: PropTypes.func
}
