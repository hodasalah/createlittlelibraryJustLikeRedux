import Goals from './Goals';
import Todos from './Todos';
import React  from 'react';
import {handleInitialData} from '../actions/shared';
import {connect} from 'react-redux';
class App extends React.Component{
  componentDidMount() {
    this.props.dispatch(handleInitialData())
  }
  render() {
    
    const {loading } = this.props
    if (loading) {
      return <h3>Loading ...</h3>;
    }
    return (
      <div style={{textAlign:'center'}}>
        <h1 style={{ textAlign: "center", color: "red" }}>
          React & Redux App
        </h1>
        <Todos />
        <Goals />
      </div>
    )}
}

export default connect((state)=>({
  loading:state.loading
}))(App);
