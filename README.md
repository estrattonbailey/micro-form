# micro-form
Simple & flexible form library for React. [Demo](http://estrattonbailey.github.io/micro-form/).

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features/Goals
1. Less features/opinions === maximum flexibility
2. Bring your own components - doesn't provide any black-boxed form fields or require cumbersome pass-through props for things like classes and styles
3. Easy validation on state change, per field basis
4. Fields can be added dynamically and the form state will update

## Usage
`micro-form` only exports two components, `Form` and `Field`. Together, these can be used to build any form element type you need.

### `Form`
`Form` takes no configuration, and accepts a single render callback as its child. This child function receives an object as it's only paramter. This object contains the following properties:

#### `state`
The full form state, determined by the components within the `<Form>` parent context. For example, given the form:
```javascript
<Form>
  {({ state }) => (
    <Field name="email" initialValue="Please enter your email!">
      ...
    </Field>
  )}
</Form>
```
`state` would look like this:
```javascript
{
  email: {
    valid: true,
    value: Please enter your email!
  }
}
``

```javascript
import { Form, Field } from 'micro-form'

<Form>
  {({ state, update, reset, validate }) => (
    <form onSubmit={e => postData(state)}>
      <Field name="email" value="" valid={boolean} validate={val => true}>
        {({ value, valid, update, validate }) => {
          return (
            <div>
              <label>Email</label>

              <input
                value={value}
                onChange={e => update(e.target.value)}
                onBlur={e => validate()}/>

              {!valid && <span style={{ color: 'red' }}>Email must include an @ sign</span>}
            </div>
          )
        }}
      </Field>
    </form>
  )}
</Form>
```

MIT License
