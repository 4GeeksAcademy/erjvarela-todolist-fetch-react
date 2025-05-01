import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEraser } from '@fortawesome/free-solid-svg-icons';

const url = "https://playground.4geeks.com"
const user = "erjvarela"

async function fetchCreateUser() {
    try {
        const response = await fetch(`${url}/todo/users/${user}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            }
        }
        )
        if (!response.ok) {
            console.log("error adding todo");
            return false
        }
        return true
    } catch (error) {
        console.log("Error at making request to add todo:", error);
        return false
    }
}

async function fetchGetTodo() {
    try {
        const response = await fetch(`${url}/todo/users/${user}`)
        if (response.status === 404) {
            const created = await fetchCreateUser()
            if (created) {
                fetchGetTodo()
            }

        }
        if (!response.ok) {
            console.log("error fetching todos");
        }
        const data = await response.json();
        console.log("Fetched todos:", data);
        return data.todos;
    } catch (error) {
        console.log("Error at making request to get todos:", error);
    }
}

async function fetchAddTodo(newTask) {
    try {
        const response = await fetch(`${url}/todo/todos/${user}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                "label": newTask,
                "is_done": false
            }),
        });
        if (!response.ok) {
            console.log("error adding todo");
        }
        const data = await response.json();
        console.log("Added todo:", data);
        return data;
    } catch (error) {
        console.log("Error at making request to add todo:", error);
        throw error;
    }
}

async function fetchDeleteTodo(todoId) {
    try {
        const response = await fetch(`${url}/todo/todos/${todoId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.log(`error deleting todo with ID: ${todoId}`);
            return false;
        } else {
            console.log(`Deleted todo with ID: ${todoId}`);
            return true;
        }
    } catch (error) {
        console.log(`Error at making request to delete todo with ID: ${todoId}`, error);
        return false;
    }
}

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState("");
    const trails = [
        { opacity: "0.6", width: "96%" },
        { opacity: "0.4", width: "94%" }
    ];

    const getTodos = async () => {
        const newTodos = await fetchGetTodo()
        setTodos(newTodos)
    }

    const addTodo = async (event) => {
        if (event.key === "Enter" && newTask.trim()) {
            const newTodo = await fetchAddTodo(newTask)
            const newTodos = [...todos, newTodo];
            setTodos(newTodos);
            setNewTask("");
        }
    };

    const removeTodo = async (idToDelete) => {
        const removed = await fetchDeleteTodo(idToDelete)
        if (removed) {
            const newTodos = todos.filter((todo) => todo.id !== idToDelete);
            setTodos(newTodos);
        }
    };

    const removeAllTodo = async () => {
        const deletePromise = todos.map((todo) => removeTodo(todo.id));
        await Promise.all(deletePromise);
        setTodos([]);
    };

    useEffect(() => {
        getTodos()
    }, []);

    const Traling = (props) => {
        return (
            <li className="list-group-item trail-item mx-auto"
                style={{ width: props.width, opacity: props.opacity }}
            ></li>
        );
    };

    const TodoItem = ({ children, deleteFunction, index }) => {
        const [showDelete, setShowDelete] = useState(false);
        return (
            <li className="list-group-item d-flex justify-content-between align-items-center todo-item mx-auto"
                onMouseEnter={() => setShowDelete(true)}
                onMouseLeave={() => setShowDelete(false)}
                style={{ width: '100%' }}
            >
                {children}
                {deleteFunction && (
                    <FontAwesomeIcon icon={faXmark}
                        className={`delete-button ${showDelete ? "" : "d-none"}`}
                        onClick={() => deleteFunction(index)}
                        style={{
                            cursor: "pointer"
                        }}
                    />
                )}
            </li >
        );
    };

    return (
        <div className="container">
            <div className="row ">
                <div className="col-12">
                    <h1 className="text-center title">todos</h1>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-6">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center todo-item mx-auto" style={{ width: '100%' }}>
                            <input
                                type="text"
                                className="todo-input mx-auto"
                                placeholder="What needs to be done?"
                                value={newTask}
                                onKeyDown={addTodo}
                                onChange={(e) => setNewTask(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </li>
                        {todos.length > 0 ? (
                            todos.map((todo) => (
                                <TodoItem key={todo.id} deleteFunction={removeTodo} index={todo.id}>
                                    <span>{todo.label}</span>
                                </TodoItem>
                            ))
                        ) : (
                            <TodoItem className="list-group-item mx-auto" style={{ width: '100%' }}><h3>No tasks, add a task</h3></TodoItem>
                        )}
                        <li className="list-group-item d-flex justify-content-between align-items-center todo-item mx-auto" style={{ width: '100%' }}>
                            <small className="todo-count font-weight-light text-muted">{todos.length} item left</small>
                            <div className="todo-delete"
                                style={{
                                    cursor: 'pointer'
                                }}
                                onClick={() => removeAllTodo()}
                            >
                                <small className="mx-1">remove tasks</small>
                                <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
                            </div>
                        </li>
                        {trails.map((trail, index) => (
                            <Traling key={index} width={trail.width} opacity={trail.opacity} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Todos;
