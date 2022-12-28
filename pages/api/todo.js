import { readDB, writeDB } from "../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";

export default async function todoRoute(req, res) {
  if (req.method === "GET") {
    // const todolist = readDB();
    // if (sortChar === "asc") {
    //   todolist.sort((a, b) => a.title.localeCompare(b.title));
    // } else if (sortChar === "desc") {
    //   todolist.sort((a, b) => b.title.localeCompare(a.title));
    // }

    const sortChar = req.query.sortChar;
    let sortOption = {};
    if (sortChar === "asc") sortOption = { title: 1 };
    else if (sortChar === "desc") sortOption = { title: -1 };

    const client = new MongoClient(process.env.MONGO_CONN_STR);
    await client.connect();
    const cursor = client
      .db("lecture-16")
      .collection("todolist")
      .find()
      .sort(sortOption);
    const todolist = await cursor.toArray();
    client.close();

    return res.json({
      ok: true,
      todolist,
    });
  } else if (req.method === "POST") {
    // const todolist = readDB();

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

    const client = new MongoClient(process.env.MONGO_CONN_STR);
    await client.connect();
    await client.db("lecture-16").collection("todolist").insertOne(newTodo);
    client.close();

    // todolist.push(newTodo);
    // writeDB(todolist);

    return res.json({ ok: true, id: newTodo.id });
  } else {
    return res.status(404).json({
      ok: false,
      message: "Invalid HTTP Method",
    });
  }
}
