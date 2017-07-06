import withFieldState from './withFieldState.js'

const createField = props => Component => withFieldState(props)(Component)

export default createField
