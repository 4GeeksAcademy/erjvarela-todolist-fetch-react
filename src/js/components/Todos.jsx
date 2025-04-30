import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState("");
    const trails = [
        { opacity: "0.8", width: "98%" },
        { opacity: "0.6", width: "96%" },
        { opacity: "0.4", width: "94%" }
    ];

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

    const addTodo = (event) => {
        if (event.key === "Enter" && newTask.trim()) {
            const newTodos = [...todos, newTask];
            setTodos(newTodos);
            setNewTask("");
        }
    };

    const removeTodo = (indexToDelete) => {
        const newTodos = todos.filter((_, index) => index !== indexToDelete);
        setTodos(newTodos);
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
                            todos.map((todo, index) => (
                                <TodoItem key={index} deleteFunction={removeTodo} index={index}>
                                    <span>{todo}</span>
                                </TodoItem>
                            ))
                        ) : (
                            <TodoItem className="list-group-item mx-auto" style={{ width: '100%' }}><h3>No tasks, add a task</h3></TodoItem>
                        )}
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
