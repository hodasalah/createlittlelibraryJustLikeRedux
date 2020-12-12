import {ADD_TODO} from '../actions/todos';  
import {ADD_GOAL} from '../actions/goals';

// add checker middleware

let checker=(store)=>(next)=>(action)=>{
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes('bitcoin')
  ) {
    return alert(`Nope. That's a bad idea. ${action.todo.name}`)
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes('bitcoin')
  ) {
    return alert(`Nope. That's a bad idea. ${action.goal.name}`)
  }
  // next === dispatch
  return next(action)
}
export default checker;