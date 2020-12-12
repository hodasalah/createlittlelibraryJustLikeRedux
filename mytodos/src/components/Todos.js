import React from 'react';
import List from './List';
import {connect } from 'react-redux';
import {handleAddTodo , 
    handleDeleteTodo ,
    handleToggleTodo}
    from '../actions/todos';


class Todos extends React.Component {
    addItem = (e) => {
      e.preventDefault();
      this.props.dispatch(handleAddTodo(this.input.value,()=>{
        return this.input.value=""
      }))
    };
    removeTodo = (todo) => {
      this.props.dispatch(handleDeleteTodo(todo));  
    };
    toggleTodo = (id) => {
      this.props.dispatch(handleToggleTodo(id));
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
  export default connect((state)=>({
    todos:state.todos
  }))(Todos);
  