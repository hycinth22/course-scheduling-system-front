function  getTodos() {
    let todos = JSON.parse(localStorage.getItem("todos"));
    if (!todos) todos = [];
    return todos;
}
function setTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function saveTodo(obj) {
    let todos = getTodos();
    const idx = todos.findIndex((elem)=>{return elem.id===obj.id});
    if (idx!==-1) {
        todos[idx] = obj;
    } else {
        todos.push(obj);
    }
    setTodos(todos);
}

function delTodo(obj) {
    let todos = getTodos();
    const idx = todos.findIndex((elem)=>elem.id===obj.id);
    console.log(todos, idx);
    if (idx!==-1) {
        todos.splice(idx,1);
        setTodos(todos);
    }
}

export {getTodos, setTodos, saveTodo, delTodo};
