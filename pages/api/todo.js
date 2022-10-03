import { readDB, writeDB } from "../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";

export default async function todoRoute(req, res) {
  if (req.method === "GET") {
    const todolist = readDB();
    const sortChar = req.query.sortChar;
    if (sortChar === "asc") {
      todolist.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortChar === "desc") {
      todolist.sort((a, b) => b.title.localeCompare(a.title));
    }

    return res.json({
      ok: true,
      todolist,
    });
  } else if (req.method === "POST") {
    const todolist = readDB();

    if (
      typeof req.body.title !== "string" ||
      req.body.title.length === 0 ||
      typeof req.body.completed !== "boolean"
    )
      return res.status(400).json({ ok: false, message: "Invalid input" });

    const newTodo = {
      id: uuidv4(),
      title: req.body.title,
      completed: req.body.completed,
    };

    todolist.push(newTodo);
    writeDB(todolist);

    return res.json({ ok: true, id: newTodo.id });
  } else {
    return res.status(404).json({
      ok: false,
      message: "Invalid HTTP Method",
    });
  }
}
