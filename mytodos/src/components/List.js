function List(props) {
    return (
      <ul style={{listStyle:'none'}}>
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
  export default List;