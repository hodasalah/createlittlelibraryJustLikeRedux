function List(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span 
          onClick={()=>props.toggleTodo&&props.toggleTodo(item.id)}
          style={{textDecoration:item.complete?'line-through':'none'}}>
              {item.name}
            </span>
          <button onClick={() => props.removeItem(item)}>X</button>
        </li>
      ))}
    </ul>
  );
}
class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    const input = this.input;
    const name = input.value;
    input.value = "";
    this.props.store.dispatch(
      addTodoAction({
        name,
        complete: false,
        id: generateId(),
      })
    );
  };
  removeTodo = (todo) => {
    return this.props.store.dispatch(removeTodoAction(todo.id));
  };
  toggleTodo=(id)=>{
      return this.props.store.dispatch(toggleTodoAction(id))
  }
  render() {
    return (
      <div>
        <h1>Todos List </h1>
        <input
          type="text"
          placeholder="add todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Todo</button>
        <List 
        items={this.props.todos} 
        removeItem={this.removeTodo}
        toggleTodo={this.toggleTodo} />
      </div>
    );
  }
}
class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    const input = this.input;
    const name = input.value;
    input.value = "";
    this.props.store.dispatch(
      addGoalAction({
        name,
        id: generateId(),
      })
    );
  };
  removeGoal = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));
  };
  render() {
    return (
      <div>
        <h1>Goals List </h1>
        <input
          type="text"
          placeholder="add goal"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Goal</button>
        <List items={this.props.goals} removeItem={this.removeGoal} />
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const { store } = this.props;
    const { todos, goals } = store.getState();
    return (
      <div>
        <h1 style={{textAlign:'center',color:'red'}}> React & Redux App</h1>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    );
  }
}
ReactDOM.render(<App store={store} />, document.getElementById("root"));
