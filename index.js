//Constants Actions
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

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
      default :
        return state
    }
}
// don't add bitcoin as todo or goal
function checkAndDispatch (store, action) {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes('bitcoin')
  ) {
    return alert("Nope. That's a bad idea.")
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes('bitcoin')
  ) {
    return alert("Nope. That's a bad idea.")
  }

  return store.dispatch(action)
}
const store = Redux.createStore(Redux.combineReducers({todos,goals}))
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
    checkAndDispatch(store, addTodoAction({
      name,
      complete: false,
      id: generateId()
    }))
    
}

function addGoal () {
    const input = document.getElementById('goal');
    const name = input.value;
    input.value = '';
    checkAndDispatch(store, addGoalAction({
      id: generateId(),
      name,
    }))
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


