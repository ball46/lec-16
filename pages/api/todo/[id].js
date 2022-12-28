import { readDB, writeDB } from "../../../backendLibs/dbLib";
import { MongoClient } from "mongodb";

export default async function todoIdRoute(req, res) {
  if (req.method === "DELETE") {
    // const todolist = readDB();
    const id = req.query.id;
    const client = new MongoClient(process.env.MONGO_CONN_STR);
    await client.connect();
    const result = await client
      .db("lecture-16")
      .collection("todolist")
      .findOneAndDelete({ id: id });
    client.close();

    if (result.value === null)
      return res.status(404).json({ ok: false, message: "Todo is not found" });

    // const todoIdx = todolist.findIndex((x) => x.id === id);
    // if (todoIdx === -1)
    //   return res.status(404).json({ ok: false, message: "Todo is not found" });
    // todolist.splice(todoIdx, 1);
    // writeDB(todolist);

    return res.json({ ok: true, id });
  } else if (req.method === "PUT") {
    // const todolist = readDB();
    const id = req.query.id;
    const client = new MongoClient(process.env.MONGO_CONN_STR);
    await client.connect();
    const result = await client
      .db("lecture-16")
      .collection("todolist")
      .findOneAndUpdate(
        { id: id },
        { $set: { completed: req.body.completed } }
      );
    client.close();

    if (result.value === null)
      return res.status(404).json({ ok: false, message: "Todo is not found" });

    //validate body
    if (typeof req.body.completed !== "boolean")
      return res.status(400).json({ ok: false, message: "Invalid input" });

    // const todoIdx = todolist.findIndex((x) => x.id === id);
    // if (todoIdx === -1)
    //   return res.status(404).json({ ok: false, message: "Todo is not found" });
    // todolist[todoIdx].completed = req.body.completed;
    // writeDB(todolist);

    return res.json({ ok: true, todo: result.value });
  }
}
