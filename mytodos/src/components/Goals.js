import React from 'react';
import List from './List';
import {connect} from 'react-redux';
import {handleAddGoal, handleDeleteGoal} from '../actions/goals'
class Goals extends React.Component {
    addItem = (e) => {
      e.preventDefault();
      this.props.dispatch(handleAddGoal(this.input.value,()=>{
        return this.input.value=''
      }));
    };
    removeGoal = (goal) => {
      this.props.dispatch(handleDeleteGoal(goal));
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
  export default connect((state)=>({
    goals:state.goals
  }))(Goals);