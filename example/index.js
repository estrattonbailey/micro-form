import React from 'react'
import { render } from 'react-dom'

import { Form, Field } from '../package/dist/index.js'

const Size = props => {
  const toppingLimits = {
    small: 3,
    medium: 3,
    large: 4
  }

  return (
    <Field name="size" value={null}>
      {({ state, value, name, setState }) => {
        return (
          <div>
            <h3>Select size</h3>
            <fieldset onChange={e => {
              const size = e.target.value
              const valid = {
                small: state.toppingCount < toppingLimits.small,
                medium: state.toppingCount < toppingLimits.medium,
                large: state.toppingCount < toppingLimits.large
              }

              setState({
                size,
                toppingCount: valid[size] ? state.toppingCount : toppingLimits[size]
              })
            }}>
              <label>
                <input type="radio" name="size" value="small"/>Small<br/>
              </label>
              <label>
                <input type="radio" name="size" value="medium"/>Medium<br/>
              </label>
              <label>
                <input type="radio" name="size" value="large"/>Large<br/>
              </label>
            </fieldset>
          </div>
        )
      }}
    </Field>
  )
}

const ToppingsCreator = ({ addTopping }) => (
  <Form>
    {({ state }) => {
      return (
        <fieldset>
          <h5>ADD TOPPING</h5>
          <Field name="toppingPlacement" value="full">
            {({ state, value, name, setState }) => (
              <select name={name} value={value} onChange={e => {
                setState({
                  toppingPlacement: e.target.value
                })
              }}>
                <option value="left-half">Left-Half</option>
                <option value="right-half">Right-Half</option>
                <option value="full">Full</option>
              </select>
            )}
          </Field>
          <Field name="topping" value="default">
            {({ state, value, name, setState }) => (
              <select name={name} value={value} onChange={e => {
                setState({
                  topping: e.target.value
                })
              }}>
                <option value="default" disabled>Select a topping</option>
                <option value="pepperoni">Pepperoni</option>
                <option value="sausage">Sausage</option>
                <option value="veggie">Veggie</option>
                <option value="pineapple">Pineapple 😎</option>
              </select>
            )}
          </Field>
          <button type="submit" onClick={e => {
            e.preventDefault()
            addTopping(state)
          }}>Add</button>
        </fieldset>
      )
    }}
  </Form>
)

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toppings: []
    }
  }

  addTopping (state) {
    this.setState({
      toppings: [...this.state.toppings, state]
    })
  }

  checkValidForm (value, state) {
    console.log(state)
    return true
  }

  render () {
    return (
      <div className="outer pv2">
        <div className="container--s mha">
          <Form>
            {({ state }) => {
              return (
                <form>
                  <h2>Create Your Pizza</h2>
                  <Size/>
                  <Field name="toppingCount" value={0}>
                    {({ state, value, name, setState }) => {
                      return state.size ? (
                        <label>
                          <h3>Select number of toppings</h3>
                          <select value={value} onChange={e => {
                            setState({
                              toppingCount: e.target.value
                            })
                          }}>
                            <option value={0}>Zero</option>
                            <option value={1}>One</option>
                            <option value={2}>Two</option>
                            <option value={3}>Three</option>
                            {state.size === 'large' && <option value={4}>Four</option>}
                          </select>
                        </label>
                      ) : null
                    }}
                  </Field>

                  {state.toppingCount > 0 && (
                    <h3>Select Toppings</h3>
                  )}

                {this.state.toppings.map((topping, i) => {
                  return i < state.toppingCount ? (
                    <Field key={i} name={`topping${i}`} value={JSON.stringify(topping)}>
                      {({ value, name }) => (
                        <h5>
                          {topping.toppingPlacement}: {topping.topping}
                          <button onClick={e => {
                            e.preventDefault()
                            this.setState({
                              toppings: this.state.toppings.splice(i, 1)
                            })
                          }}>X</button>
                        </h5>
                      )}
                    </Field>
                  ) : null
                })}

                  {(state.toppingCount > 0 && this.state.toppings.length < state.toppingCount) && (
                    <ToppingsCreator addTopping={this.addTopping.bind(this)}/>
                  )}

                  <Field name="submit" value="Order" validate={this.checkValidForm.bind(this)}>
                    {({ value, valid }) => (
                      <button type="submit" disabled={!valid}>Order</button>
                    )}
                  </Field>
                </form>
              )
            }}
          </Form>
        </div>
      </div>
    )
  }
}

render(
  <App/>,
  document.getElementById('root')
)
