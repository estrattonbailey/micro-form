import React from 'react'
import withFieldState from './withFieldState.js'

const createFactory = Component => class Factory extends React.Component {
  constructor (props) {
    super(props)
    this.Component = withFieldState(props)(Component)
  }

  render () {
    const { Component, props } = this
    const { initialValue, valid, validate, ...p } = props // eslint-disable-line no-unused-vars
    return <Component {...p} />
  }
}

export default createFactory

