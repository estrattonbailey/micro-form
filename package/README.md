# micro-form
Simple & flexible form library for React. [Demo](http://estrattonbailey.github.io/micro-form/).

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features/Goals
1. Less features/opinions === maximum flexibility
2. Bring your own components - doesn't provide any black-boxed form fields or require cumbersome pass-through props for things like classes and styles
3. Easy validation on state change, per field basis
4. Fields can be added dynamically and the form state will update

## Usage
```javascript
<FormProvider>
  {( state ) => (
    <form onSubmit={e => postData(state)}>
      <Field name="email" value="" valid={boolean}>
        {({ value, valid, update, validate }) => {
          return (
            <div>
              <label>Email</label>

              <input
                value={value}
                onChange={e => update(e.target.value)}
                onBlur={e => validate(
                  /@/.test(e.target.value)
                )}/>

              {!valid && <span style={{ color: 'red' }}>Email must include an @ sign</span>}
            </div>
          )
        }}
      </Field>
    </form>
  )}
</FormProvider>
```

MIT License
