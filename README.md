# micro-form
Low-level localized state form building library for React.

## Features/Goals
1. Mimic other libraries like [formsy-react](https://github.com/christianalfoni/formsy-react) and [react-redux-form](https://github.com/davidkpiano/react-redux-form) but deliver the bare minimum on features in exchange for maximum flexibility.
2. BYOC - bring your own components - doesn't provide any black-boxed form fields or require cumbersome pass-through props for things like classes and styles.
3. Easy validation on state change, per field basis
4. It's like way, way smaller

Honestly, this doesn't have to be used for forms. A very similar pattern could be used for any stateful UI you wanted.

## The Basic Idea
Insert `Field`s inside a local `Form` context. Each field inherits and mounts to the localized state using its `name` prop. Render-callbacks receive localized `state`, Field specific `value`, `name` & `valid` property (returned by `validate` method, if one is defined), and a `setState` method to update localized state.

Validate methods are passed `(fieldValue, localizedState)` and should return true/false.

```javascript
<Form>
{({ state }) => (
  <form onSubmit={e => {
    e.preventDefault()
    console.log(state) // form state
  }}>
    <Field name="username" value={null} validate={(value, state) => {
      return /usernameregex/.test(value) // return true or false
    }}>
      {({ state, value, name, valid, setState }) => (
        <input type="email" name={name} value={value} onChange={e => {
          setState({
            username: e.target.value
          })
        }}>
      )}
    </Field>
    <Field name="submit" value={'Submit'} validate={(value, state) => {
      return state.username // if username is populated
    }}>
      {({ state, value, name, valid, setState }) => (
        <input type="submit" name={name} value={value} disabled={!valid}/>
      )}
    </Field>
  </form>
)}

/*

Form state for this form would look like this:

{
  username: 'estrattonbailey',
  submit: 'Submit'
}
```

## Things This Doesn't Do
1. Batch updates outside of its use of `this.setState`, so not sure on performance implications on large forms, i.e. great for small forms, probably better to use a dedicated state library like redux for big stuff (duh).

## TODO
1. Define clearer API methods, callback params
2. Examples
3. Is this even a Good Idea™?
