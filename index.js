//Constants Actions
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'
const RECEIVE_DATA = 'RECEIVE_DATA'
/*==========================================
            [[[functions creators]]]
============================================*/
// make action creators
function addTodoAction (todo) {
    return {
      type: ADD_TODO,
      todo,
    }
}
  
function removeTodoAction (id) {
    return {
      type: REMOVE_TODO,
      id,
    }
}
  
function toggleTodoAction (id) {
    return {
      type: TOGGLE_TODO,
      id,
    }
}
  
function addGoalAction (goal) {
    return {
      type: ADD_GOAL,
      goal,
    }
}
  
function removeGoalAction (id) {
    return {
      type: REMOVE_GOAL,
      id
    }
}
function receiveDataAction(todos ,goals){
  return{
    type:RECEIVE_DATA,
    todos,
    goals
  }
}

//Asynchoronous ActionCreator [thunk]
//[handle Initial Data]
function handleInitialData(){
  return(dispatch)=>{
    return Promise.all([API.fetchTodos(), API.fetchGoals()])
        .then(([todos, goals]) => {
          dispatch(receiveDataAction(todos, goals));
    });
  }
}
//[DeleteTodoAction]
function handleDeleteTodoAction (todo){
  return(dispatch)=>{
    dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id)
      .catch(()=>{
        dispatch(addTodoAction(todo));
        alert("An Error occured try again");
      })
  }
}
//[DeleteGoalAction]
function handleDeleteGoalAction (goal){
  return(dispatch)=>{
    dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id)
      .catch(()=>{
        dispatch(addGoalAction(goal));
        alert("An Error occured try again");
      })
  }
}
//[AddTodoAction]
function handleAddTodo(name , callback){
  return(dispatch)=>{
    return API.saveTodo(name)
      .then(todo=>{
        dispatch(addTodoAction(todo))
        callback();
      })
      .catch(()=>alert('AnError occured try again'))
  }
}
//[AddGoalAction]
function handleAddGoal(name , callback){
  return(dispatch)=>{
    return API.saveGoal(name)
      .then(goal=>{
        dispatch(addGoalAction(goal))
        callback();
      })
      .catch(()=>alert('AnError occured try again'))
  }
}
//[toggle todo action]
function handleToggleTodoAction(id){
  return(dispatch)=>{
    dispatch(toggleTodoAction(id));
    return API.saveTodoToggle(id).catch(()=>{
      dispatch(toggleTodoAction(id));
      alert('An Error occured :Try Again')
    })
  }
}
/**
 * if we don't use thunk middleware
 * redux.min.js:1 Uncaught Error: Actions must be plain objects. 
 * Use custom middleware for async actions.
 */
/*==========================================
            [[[Reducers]]]
============================================*/
//todosReducer
function todos (state = [], action) {
    switch(action.type) {
      case ADD_TODO :
        return state.concat([action.todo])
      case REMOVE_TODO :
        return state.filter((todo) => todo.id !== action.id)
      case TOGGLE_TODO :
        return state.map((todo) => todo.id !== action.id ? todo :
          Object.assign({}, todo, { complete: !todo.complete }))
      case RECEIVE_DATA :
        return action.todos
      default :
        return state
    }
}
//goalsReducer
function goals (state = [], action) {
    switch(action.type) {
      case ADD_GOAL :
        return state.concat([action.goal])
      case REMOVE_GOAL :
        return state.filter((goal) => goal.id !== action.id)
      case RECEIVE_DATA :
        return action.goals
      default :
        return state
    }
}
//Loading Reducer
function loading(state=true , action){
  switch(action.type){
    case RECEIVE_DATA :
      return false;
    default:
      return state;
  }
}

// don't add bitcoin as todo or goal
/*==========================================
            [[[middlewares]]]
============================================*/
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
//add logger middleware
let logger =(store)=>(next)=>(action)=>{
  console.group(action.type);
    console.log('the action is >>', action);
    let result= next(action);
    console.log('new state is >>', store.getState());
  console.groupEnd()
  return result
}
// add thunk(we will create it ) middleware
/* const Thunk = (store)=>(next)=>(action)=>{
  if(typeof action === 'function'){
    return action(store.dispatch);
  }
  // if action === plain object
    return next(action)
} */
//createStore(reducer , enhancers)
const store = Redux.createStore(
  Redux.combineReducers({todos,goals,loading}),
  Redux.applyMiddleware(ReduxThunk.default,checker , logger )
  )
// generate unique ids
function generateId () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

store.subscribe(() => {
    const {todos ,goals} = store.getState()
    document.getElementById('todos').innerHTML='';
    document.getElementById('goals').innerHTML='';
    todos.forEach(addTodoToDom);
    goals.forEach(addGoalToDom);
})
// Dom code
function addTodo () {
    const input = document.getElementById('todo')
    const name = input.value
    input.value = ''
    store.dispatch(addTodoAction({
      name,
      complete: false,
      id: generateId()
    }));
    
}

function addGoal () {
    const input = document.getElementById('goal');
    const name = input.value;
    input.value = '';
    store.dispatch(addGoalAction({
      id: generateId(),
      name,
    }));
}
function createRemoveBTN(onClick){
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.addEventListener('click', onClick);
  return removeBtn;
}
function addTodoToDom(todo){
  let node = document.createElement('li');
  let text = document.createTextNode(todo.name);
  let removeBtn=createRemoveBTN(
    ()=>store.dispatch(removeTodoAction(todo.id))
  );
  node.appendChild(text);
  node.appendChild(removeBtn);
  node.style.textDecoration= todo.complete? 'line-through' :'none';
  // setup event listner to this node 
  node.addEventListener('click' ,()=>{
    store.dispatch(toggleTodoAction (todo.id));
  });
  return document.getElementById('todos').appendChild(node);
}
//addGoalToDom
function addGoalToDom(goal){
  let node = document.createElement('li');
  let text = document.createTextNode(goal.name);
  node.appendChild(text);
  node.appendChild(createRemoveBTN(
    ()=>store.dispatch(removeGoalAction(goal.id))
  ));
  
  return document.getElementById('goals').appendChild(node);
}
document.getElementById('todoBtn').addEventListener('click', addTodo)

document.getElementById('goalBtn').addEventListener('click', addGoal)


