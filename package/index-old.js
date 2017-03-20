import React, { PropTypes, Component } from 'react'

function completeAssign(target, ...sources) {
  sources.forEach(source => {
    Object.defineProperties(
      target,
      Object.keys(source).reduce((props, key) => {
        props[key] = Object.getOwnPropertyDescriptor(source, key)
        return props
      }, {})
    )
  })

  return target
}

export class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {}
    }
  }

  static childContextTypes = {
    update: PropTypes.func,
    updateFields: PropTypes.func,
    getFields: PropTypes.func
  }

  getChildContext () {
    const _ = this

    return {
      update () {
        _.forceUpdate()
      },
      updateFields (obj) {
        _.setState({
          fields: completeAssign(_.state.fields, obj)
        })
      },
      getFields () {
        return _.state.fields
      }
    }
  }

  render () {
    return this.props.children({
      fields: this.state.fields,
    })
  }
}

export class Field extends Component {
  static contextTypes = {
    update: PropTypes.func,
    updateFields: PropTypes.func,
    getFields: PropTypes.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      name: props.name,
      value: props.value
    }

    this.local = Object.defineProperty({}, this.state.name, {
      set: value => {
        this.setState({ value })
        this.context.update()
      },
      get: () => this.state.value,
      enumerable: true
    })
  }

  componentWillMount () {
    this.context.updateFields(this.local)
  }

  render() {
    const props = {
      ...this.state,
      fields: this.context.getFields(),
    }

    return this.props.children(props)
  }
}
