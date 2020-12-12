import API from 'goals-todos-api';

export const RECEIVE_DATA = 'RECEIVE_DATA'
// action creator
function receiveData(todos ,goals){
    return{
      type:RECEIVE_DATA,
      todos,
      goals
    }
}
// thunk action creator
export function handleInitialData(){
    return(dispatch)=>{
      return Promise.all([API.fetchTodos(), API.fetchGoals()])
          .then(([todos, goals]) => {
            dispatch(receiveData(todos, goals));
      });
    }
}