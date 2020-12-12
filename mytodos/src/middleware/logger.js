//add logger middleware
let logger =(store)=>(next)=>(action)=>{
    console.group(action.type);
      console.log('the action is >>', action);
      let result= next(action);
      console.log('new state is >>', store.getState());
    console.groupEnd()
    return result
}
  export default logger;