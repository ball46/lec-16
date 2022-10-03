import fs from "fs";

export function readDB() {
  const todolistStr = fs.readFileSync("db/todolist.json", {
    encoding: "utf-8",
  });
  const todolist = JSON.parse(todolistStr);
  return todolist;
}

export function writeDB(todolist) {
  const todolistStr = JSON.stringify(todolist);
  fs.writeFileSync("db/todolist.json", todolistStr, { encoding: "utf-8" });
}
