function List(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() => props.toggleTodo && props.toggleTodo(item.id)}
            style={{ textDecoration: item.complete ? "line-through" : "none" }}
          >
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
    return API.saveTodo(this.input.value)
      .then(todo=>{
        this.props.store.dispatch(addTodoAction(todo))
        this.input.value=''
      })
      .catch(()=>alert('AnError occured try again'))
  };
  removeTodo = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id).catch(()=>{
      this.props.store.dispatch(addTodoAction(todo));
      alert('An Error occured :Try Again')
    })
  };
  toggleTodo = (id) => {
    this.props.store.dispatch(toggleTodoAction(id));
    return API.saveTodoToggle(id).catch(()=>{
      this.props.store.dispatch(toggleTodoAction(id));
      alert('An Error occured :Try Again')
    })
  };
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
          toggleTodo={this.toggleTodo}
        />
      </div>
    );
  }
}
class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    return API.saveGoal(this.input.value)
      .then((goal)=>{
        this.props.store.dispatch(addGoalAction(goal))
        this.input.value=''
      })
      .catch(()=>alert('An Error Occured try again'))
  };
  removeGoal = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(()=>{
      this.props.store.dispatch(addGoalAction(goal));
      alert('An Error occured . Try Again')
    })
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
    Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
      store.dispatch(receiveDataAction(todos, goals));
    });
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();
    if (loading) {
      return <h3>Loading ...</h3>;
    }
    return (
      <div>
        <h1 style={{ textAlign: "center", color: "red" }}>
          {" "}
          React & Redux App
        </h1>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    );
  }
}
ReactDOM.render(<App store={store} />, document.getElementById("root"));
