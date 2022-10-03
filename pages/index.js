import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);
  const [sortChar, setSortChar] = useState("");

  const callGetTodo = async () => {
    try {
      const resp = await axios.get(`/api/todo?sortChar=${sortChar}`);
      setTodos(resp.data.todolist);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const callPostTodo = async () => {
    try {
      const resp = await axios.post("/api/todo", {
        title: todoText,
        completed: false,
      });
      if (resp.data.ok) await callGetTodo();
      setTodoText("");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const callDeleteTodo = async (id) => {
    try {
      const resp = await axios.delete(`/api/todo/${id}`);
      if (resp.data.ok) await callGetTodo();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const callPutTodo = async (id, completed) => {
    try {
      const resp = await axios.put(`/api/todo/${id}`, {
        completed,
      });
      if (resp.data.ok) await callGetTodo();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    callGetTodo();
  }, [sortChar]);

  return (
    <div>
      <input
        onChange={(e) => setTodoText(e.target.value)}
        value={todoText}
        onKeyUp={(e) => {
          if (e.key !== "Enter") return;
          callPostTodo();
        }}
      />
      <label style={{ marginLeft: "5px" }}>Sort</label>
      <select onChange={(e) => setSortChar(e.target.value)} value={sortChar}>
        <option value="">-</option>
        <option value="asc">A-Z</option>
        <option value="desc">Z-A</option>
      </select>
      <ul>
        {todos.map((x) => (
          <li
            key={x.id}
            style={{ textDecoration: x.completed ? "line-through" : "none" }}
          >
            {x.title}
            <button
              onClick={() => {
                callPutTodo(x.id, !x.completed);
              }}
            >
              Done
            </button>
            <button
              onClick={() => {
                callDeleteTodo(x.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
