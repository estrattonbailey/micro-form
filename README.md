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

```javascript
import { Form, Field } from 'micro-form'

...
```

### `Form`
`Form` takes no configuration, and accepts a single render callback as its child. This child function receives an object as it's only paramter.
```javascript
<Form>
  {({ state, valid, validate, reset, update }) => (
    <form>
      ...
    </form>
  )}
</Form>
```

#### `state: object`
The full form state, determined by the components within the `<Form>` parent context. For example, given the form:
```javascript
<Form>
  {({ state }) => (
    <form>
      <Field name="email" initialValue="Please enter your email!">
        ...
      </Field>
    </form>
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
```

#### `valid: boolean`
Simply checks if the form is valid on each state change
```javascript
<Form>
  {({ state, valid }) => (
    <form>
      <Field name="email" initialValue="Please enter your email!">
        ...
      </Field>
      
      <button disabled={!valid}>Submit</button>
    </form>
  )}
</Form>
```

#### `validate: function`
Runs all existing validation checks on each field and rerenders the form with any configured error states. Calling `validate` returns a boolean indicating whether the form is valid or not. 

Field validator functions are defined on a field-by-field basis, which we'll cover next. Without a `validate` function, `Field`s will always return `valid === true`.
```javascript
<Form>
  {({ state, valid, validate }) => (
    <form onSubmit={e => {
      e.preventDefault()
      validate() && myFormSubmissionMethod(state)
    }}>
      <Field name="email" initialValue="Default value" validate={value => value !== 'Default value'}>
        ...
      </Field>
      
      <button disabled={!valid}>Submit</button>
    </form>
  )}
</Form>
```

#### `reset: function`
When called, simply resets form to its original values.

#### `update: function`
Updated is basically a wrapper for `setState`, and can be used the same way, including the adding a callback. *This is kind a low-level API and you probably don't want to use it.*
```javascript
<Form>
  {({ state, valid, update }) => (
    <form>
      <Field name="email" initialValue="Please enter your email!">
        ...
      </Field>
      
      <button onClick={e => {
        update(Object.assign(state, {
          test: {
            valid: true,
            value: 'Test field'
          }
        }), () => console.log('Added test field'))
      }}>Add a test field</button>
      
      <button disabled={!valid}>Submit</button>
    </form>
  )}
</Form>
```

MIT License
