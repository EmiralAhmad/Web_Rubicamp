const express = require("express");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

// Creating the Express server
const app = express();

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connection to the SQlite database
const db_name = path.join(__dirname, "data", "todos.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'todos.db'");
});

// Creating the Books table (id, String, Nominal, SpecificNominal, Tanggal, Condition)
const sql_create = `CREATE TABLE IF NOT EXISTS todos(
  id integer(15) PRIMARY KEY,
  String varchar(30) NOT NULL UNIQUE,
  Nominal integer(15) NOT NULL UNIQUE,
  SpecificNominal float(15) NOT NULL UNIQUE,
  Tanggal date(15) NOT NULL UNIQUE,
  Condition boolean(5)
);`;

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'todos' table");

  // Database seeding
  const sql_insert = `INSERT INTO todos (id, String, Nominal,SpecificNominal, Tanggal, Condition) 
  VALUES
  ('1','Jajan', 23, 0.45, '2008-11-11', true),
  ('2','Jalan', 25, 0.46, '2009-11-11', true);`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of todos");
  });
});

//Starting The Server

// GET /
app.get("/", (req, res) => {
  // res.send("Hello world...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});

// GET /books
app.get("/todos", (req, res) => {
  const sql = "SELECT * FROM todos ORDER BY String";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("todos", { model: rows });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO todos (id, String, Nominal,SpecificNominal, Tanggal, Condition) VALUES (?,?,?,?,?,?)";
  const book = [req.body.id, req.body.String, req.body.Nominal, req.body.SpecificNominal, req.body.Tanggal, req.body.Condition];
  db.run(sql, todos, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/todos");
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM todos WHERE id = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.String, req.body.Nominal, req.body.SpecificNominal, req.body.Tanggal, req.body.Condition, id];
  const sql = "UPDATE todos SET String = ?, Nominal = ?, SpecificNominal = ?, Tanggal = ?, Condition = ? WHERE (id = ?)";
  db.run(sql, todos, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/todos");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM todos WHERE id = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM todos WHERE id = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/todos");
  });
});