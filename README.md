# micro-form
Low-level localized state form building library for React. [Demo](http://estrattonbailey.github.io/micro-form/).

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features/Goals
1. Mimic other libraries like [formsy-react](https://github.com/christianalfoni/formsy-react) and [react-redux-form](https://github.com/davidkpiano/react-redux-form) but deliver the bare minimum on features in exchange for maximum flexibility.
2. BYOC - bring your own components - doesn't provide any black-boxed form fields or require cumbersome pass-through props for things like classes and styles.
3. Easy validation on state change, per field basis
4. It's like way, way smaller **~1.3kb gzipped** 👍🏼

Honestly, this doesn't have to be used for forms. A very similar pattern could be used for any stateful UI you wanted.

## Usage
Create localized contexts using `LocalContext` export. The `LocalContext` HOC accepts a single *render callback* (function as a child). This child function receives `localState` (the state of the full form) and `resetLocalState`, a function to... reset the state object to its initial values (you'll set those later).
```javascript
import { LocalContext, LocalField } from 'micro-form'

const App = props => (
  <LocalContext>
    {({ localState, resetLocalState }) => (
      {/* form goes here */}
    )}
  </LocalContext>
)
```

Then, add `LocalFields` as needed. `LocalFields` are just HOC that also accept a render callback. The child function is passed field specific values, as well as the full state and helpful methods from the parent `LocalContext` further up the tree.

Each `LocalField` accepts the following params:
- `initialValue` - a value used initially, and if the form is reset
- `name` - the name of the field
- `validate` - a validation fn with the signature `validate(localFieldValue, localContextState)` that should return a boolean

The render callback of each `LocalField` is passed an object with the following values:
- `value` - field value
- `name` - field name
- `valid` - boolean indicating the returned value from the `validate` method (defaults to true)
- `localState` - the state of the entire `LocalContext`
- `setLocalState` - set values on the `LocalContext` state object
- `resetLocalState` - resets all fields to their initial values

```javascript
import { LocalContext, LocalField } from 'micro-form'

const App = props => (
  <LocalContext>
    {({ localState, resetLocalState }) => (
      <form action="/">
        <LocalField
          initialValue="estrattonbailey"
          name="username"
          validate={(username, localState) => username.length > 0}>
          {({ value, name, valid, localState, setLocalState, resetLocalState }) => (
            <input name={name} value={value} className={valid ? '' : 'has-error'} onChange={e => {
              setLocalState({
                [name]: value
              })
            }}/>
          )}
        </LocalField>
      </form>
    )}
  </LocalContext>
)
```

## Flexibility
Micro Form only serves as the underpinnings of a form's state: all the markup is left up to you. And because it uses React's context API, you can structure your code however you like, fields can be added dynamically, and the whole form's state will update automatically.
