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
`<Form>` takes no configuration, and accepts a single render callback as its child. This child function receives an object as it's only paramter.
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

Field validator functions are defined on a field-by-field basis, which we'll cover next. Without a `validate` function, `<Field>`s will always return `valid === true`.
```javascript
<Form>
  {({ state, valid, validate }) => (
    <form onSubmit={e => {
      e.preventDefault()
      validate() && myFormSubmissionMethod(state)
    }}>
      <Field
        name="email"
        initialValue="Default value"
        validate={value => value !== 'Default value'}
        valid={true}>
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
  {({ state, valid, validate, reset, update }) => (
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

### `<Field>`
`<Field>`s are where you define the initial state of each field within the `<Form>`. `<Field>`s can be added dynamicallly, and the form state will update accordingly. Fields accept four initial properties, and also return a render callback, similar to `<Form>` components.

The initial configurable properties are:
- `name` - becomes the *key* on the state object for this field
- `initialValue` - if the field should be pre-populated with data, insert it here
- `validate` - a function with the signature `value => boolean`, returning `true` or `false`
- `valid` - an initial boolean value to set the validity of the field at startup, defaults to `true`

```javascript
<Form>
  {({ state, valid, validate }) => (
    <form onSubmit={e => {
      e.preventDefault()
      validate() && myFormSubmissionMethod(state)
    }}>
      <Field
        name="email"
        initialValue="Default value"
        validate={value => value !== 'Default value'}
        valid={true}>
        ...
      </Field>
      
      <button disabled={!valid}>Submit</button>
    </form>
  )}
</Form>
```

Each `<Field>` then accepts a single render callback that is also passed an object with helpful properties:

```javascript
<Field
  name="email"
  initialValue="Default value"
  validate={value => value !== 'Default value'}
  valid={true}>
  {({ value, valid, update, validate }) => (
    ...
  )}
</Field>
```

#### `value: any`
The value tracked by the form state, or `initialValue` on startup.
```javascript
<Field
  name="email"
  initialValue="Default value"
  validate={value => value !== 'Default value'}
  valid={true}>
  {({ value, valid, update, validate }) => (
    <div>
      <input
        name="email"
        value={value}/>
    </div>
  )}
</Field>
```

#### `valid: boolean`
Defaults to true, and is not re-evaluated unless you call `validate` within your `<Field>` or `<Form>`.

#### `update: function`
This is how you update state for your field. Simply pass your new field value when you like, and the `<Form>` will update.
```javascript
<Field
  name="email"
  initialValue="Default value"
  validate={value => value !== 'Default value'}
  valid={true}>
  {({ value, valid, update, validate }) => (
    <div>
      <input
        name="email"
        value={value}
        onChange={e => update(e.target.value)}/>
    </div>
  )}
</Field>
```

#### `validate: function`
When called, the `validate` method calls the `validate` config method you added to your `<Field>`. This validator function is passed the current `value` of your field automatically.
```javascript
<Field
  name="email"
  initialValue="Default value"
  validate={value => value !== 'Default value'}
  valid={true}>
  {({ value, valid, update, validate }) => (
    <div>
      <input
        name="email"
        value={value}
        onChange={e => update(e.target.value)}
        onBlur={e => validate()}/>
    </div>
  )}
</Field>
```

*Optionally,* you can also pass a custom validator function to validate, perhaps depending on what value was input to your `<Field>`.
```javascript
<Field
  name="email"
  initialValue="Default value"
  validate={value => value !== 'Default value'}
  valid={true}>
  {({ value, valid, update, validate }) => (
    <div>
      <input
        name="email"
        value={value}
        onChange={e => update(e.target.value)}
        onBlur={e => validate(value => /@/.test(value)}/>
    </div>
  )}
</Field>
```

### Pass-through properties
Since these are render callbacks, React is watching for changes to the `props` of the `<Field>`, not the child components of the `<Field>`. Because of this, to get parent state to render updates to the child components, parent state can be added to the `<Field>` and it will be *merged* with the form utilties.
```javascript
class Parent extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      property: 'Parent state!'
    }
  }
  
  render () {
    return (
      <Field
        name="email"
        initialValue="Default value"
        validate={value => value !== 'Default value'}
        valid={true}
        parentState={this.state}>
        {({ value, valid, update, validate, parentState }) => (
          <div>
            <input
              name="email"
              value={value}
              onChange={e => update(e.target.value)}
              onBlur={e => validate(value => /@/.test(value)}/>
          </div>
        )}
      </Field>
    )
  }
}
```

## Benefits
#### Build any form element using the same methods
In fact, they don't even have to be form elements! All we're doing here is co-locating state with a component and rendering some markup based on the return values.
#### Dynamically added `Fields` will update `Form` state automatically
This means easy componentization and easy reusability.

## Caveats
#### The markup is entirely up to the user
While this means maximum flexibility, it also means that you need to write your own valid form elements. Simple helper functions make this trivial:
```javascript
// Input.js
const Input = ({ name, label, type, value = '' }) => (
  <Field
    name="email"
    initialValue="Default value"
    validate={value => value !== 'Default value'}
    valid={true}>
    {({ value, valid, update, validate }) => {
      return (
        <div>
          <label>{label}</label>

          <input
            name={name}
            type={type}
            value={value}
            onChange={e => update(e.target.value)}
            onBlur={e => validate()}/>

          {!valid && <span style={{ color: 'red' }}>Field is blank!</span>}
        </div>
      )
    }}
  </Field>
)

// App.js
<Form>
  {props => (
    <form>
      <Input name="email" type="email" label="Please enter your email"/>
    </form>
  )}
</Form>
```

## Dependencies
- [microstate](https://github.com/estrattonbailey/microstate) - Co-located & composable state management for React by [@estrattonbailey](https://github.com/estrattonbailey).

MIT License
