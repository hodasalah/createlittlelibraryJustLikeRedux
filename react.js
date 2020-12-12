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
    this.props.dispatch(handleAddTodo(this.input.value,()=>{
      return this.input.value=""
    }))
  };
  removeTodo = (todo) => {
    this.props.dispatch(handleDeleteTodoAction(todo));  
  };
  toggleTodo = (id) => {
    this.props.dispatch(handleToggleTodoAction(id));
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
/* class ConnectedTodos extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { todos } = store.getState()

          return <Todos todos={todos} dispatch={store.dispatch} />
        }}
      </Context.Consumer>
    )
  }
} */
const ConnectedTodos = connect((state)=>({
  todos:state.todos
}))(Todos)
class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    this.props.dispatch(handleAddGoal(this.input.value,()=>{
      return this.input.value=''
    }));
  };
  removeGoal = (goal) => {
    this.props.dispatch(handleDeleteGoalAction(goal));
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
/* class ConnectedGoals extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { goals } = store.getState()

          return <Goals goals={goals} dispatch={store.dispatch} />
        }}
      </Context.Consumer>
    )
  }
} */
const ConnectedGoals  =connect((state)=>({
  goals:state.goals
}))(Goals)
class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(handleInitialData())
  }
  render() {
    
    const {loading } = this.props
    if (loading) {
      return <h3>Loading ...</h3>;
    }
    return (
      <div>
        <h1 style={{ textAlign: "center", color: "red" }}>
          {" "}
          React & Redux App
        </h1>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    );
  }
}
/* class ConnectedApp extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => (
          <App store={store} />
        )}
      </Context.Consumer>
    )
  }
} */
const ConnectedApp = connect((state)=>({
  loading:state.loading
}))(App)
function connect(mapStateToProps) {
  return (Component)=>{
    class Receiver extends React.Component{
      componentDidMount(){
        const{subscribe}= this.props.store;
        this.unSubscribe = subscribe(()=>{this.forceUpdate()})
      }
      componentWillUnmount(){
        this.unSubscribe();
      }
      render(){
        const {dispatch,getState}= this.props.store;
        const state = getState();
        const connectedState = mapStateToProps(state)
        return(
          <Component {...connectedState} dispatch={dispatch}/>
        )
      }
    }
    class ConnectedComponent extends React.Component{
      render(){
        return(
          <Context.Consumer>
            {(store)=><Receiver store={store}/> }
          </Context.Consumer>
        )
      }
    }
    return ConnectedComponent 
  } 
}
const Context = React.createContext()

class Provider extends React.Component {
  render () {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)
