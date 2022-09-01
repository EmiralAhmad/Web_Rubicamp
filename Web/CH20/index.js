const sqlite3 = require('sqlite3');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const url = require('url');
const app = express();
const port = 3020;
let data;
let allData;

const db = new sqlite3.Database('data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

function listDb(input, offset, callback) {
  let sql = 'SELECT * FROM data';
  if (input.idCB == 'on' && input.id !== '') {
    sql = sql + ' WHERE id =' + input.id;
  }
  if (input.stringCB == 'on' && input.string !== '') {
    if (sql.includes('WHERE')) {
      sql = sql + ` LIKE string '%${input.string}'`;
    } else {
      sql = sql + ` WHERE string LIKE '%${input.string}'`;
    }
  }
  if (input.integerCB == 'on' && input.integer !== '') {
    if (sql.includes('WHERE')) {
      sql = sql + ' AND integerinput =' + input.integer;
    } else {
      sql = sql + ' WHERE integerinput =' + input.integer;
    }
  }
  if (input.floatCB == 'on' && input.float !== '') {
    if (sql.includes('WHERE')) {
      sql = sql + ' AND floatinput =' + input.float;
    } else {
      sql = sql + ' WHERE floatinput =' + input.float;
    }
  }
  if (input.dateCB == 'on' && input.startDate !== '') {
    if (sql.includes('WHERE')) {
      sql = sql + ` AND dateinput BETWEEN '${input.StartDate}' AND '${input.EndDate}'`;
    
    } else if (sql.includes('WHERE')) {
      sql = sql + `AND dateinput '${input.StartDate}'`;
      
    } else if (sql.includes('WHERE')) {
      sql = sql + `AND dateinput '${input.EndDate}'`

    } else {
      sql = sql + ` WHERE dateinput BETWEEN '${input.StartDate}' AND '${input.EndDate}'`;
    }
  }
  if (input.booleanCB == 'on' && input.boolean !== '') {
    if (sql.includes('WHERE')) {
      sql = sql + ` AND booleaninput = '${input.boolean}'`;
    } else {
      sql = sql + ` WHERE booleaninput = '${input.boolean}'`;
    }
  }
  sql = sql + ' ORDER BY id ASC LIMIT 3 OFFSET ?';
  console.log(sql);
  db.all(sql, [offset], (err, rows) => {
    if (err) {
      return console.error(err.message);
    } else {
      callback(rows);
    }
  });
}

function countData(input, callback) {
  let total = 'SELECT COUNT(*) AS total FROM data';
  if (input.idCB == 'on' && input.id !== '') {
    total = total + ' WHERE id =' + input.id;
  }
  if (input.stringCB == 'on' && input.string !== '') {
    if (total.includes('WHERE')) {
      total = total + ` LIKE string '${input.string}'`;
    } else {
      total = total + ` WHERE string LIKE '%${input.string}' `;
    }
  }
  if (input.integerCB == 'on' && input.integer !== '') {
    if (total.includes('WHERE')) {
      total = total + ' AND integerinput =' + input.integer;
    } else {
      total = total + ' WHERE integerinput =' + input.integer;
    }
  }
  if (input.floatCB == 'on' && input.float !== '') {
    if (total.includes('WHERE')) {
      total = total + ' AND floatinput =' + input.float;
    } else {
      total = total + ' WHERE floatinput =' + input.float;
    }
  }
  if (input.dateCB == 'on' && input.startDate !== '') {
    if (total.includes('WHERE')) {
      total = total + ` AND dateinput BETWEEN '${input.StartDate}' AND '${input.EndDate}'`;

    } else if (total.includes('WHERE')) {
      sql = total + `AND dateinput '${input.StartDate}'`;
      
    } else if (total.includes('WHERE')) {
      sql = total + `AND dateinput '${input.EndDate}'`

    } else {
      total = total + ` WHERE dateinput BETWEEN '${input.StartDate}' AND '${input.EndDate}'`;
    }
  }
  if (input.booleanCB == 'on' && input.boolean !== '') {
    if (total.includes('WHERE')) {
      total = total + ` AND booleaninput = '${input.boolean}'`;
    } else {
      total = total + ` WHERE booleaninput = '${input.boolean}'`;
    }
  }
  total = total + ' ORDER BY id ASC';

  db.all(total, [], (err, total) => {
    if (err) {
      return console.error(err.message);
    } else {
      callback(total);
    }
  });
}

function indexList(callback) {
  db.all('SELECT * FROM data ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    } else {
      callback(rows);
    }
  });
}

function writeDb(string, integer, float, date, boolean) {
  db.run(
    `INSERT INTO DATA(string, integerinput, floatinput, dateinput, booleaninput) 
  VALUES (?, ?, ?, ?, ?)`,
    [string, integer, float, date, boolean],
    (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );
}

function deleteDb(id) {
  db.run('DELETE FROM data WHERE id=?', [id], (err, rows) => {
    if (err) return console.error(err.message);
  });
}

function updateDb(string, integer, float, date, boolean, id) {
  db.run(
    `UPDATE data SET 
  string = ?,
  integerinput = ?,
  floatinput = ?,
  dateinput = ?,
  booleaninput = ?
  WHERE id = ?`,
    [string, integer, float, date, boolean, id],
    (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const limit = 3;
  let currentOffset;
  let totalPage;
  let pageInput = parseInt(req.query.page);
  let currentLink;
  if (!req.query.page) {
    currentOffset = 1;
    pageInput = 1;
  } else {
    currentOffset = parseInt(req.query.page);
  }
  const offset = limit * currentOffset - limit;
  listDb(req.query, offset, (rows) => {
    console.log(rows);
    data = rows;
    countData(req.query, (rows) => {
      total = rows;
      totalPage = Math.ceil(total[0].total / limit);
      if (req.url === '/') {
        currentLink = '/?page=1';
      } else {
        if (req.url.includes('/?page')) {
          currentLink = req.url;
        } else {
          if (req.url.includes('&page=')) {
            currentLink = req.url;
          } else {
            if (req.url.includes('&page=')) {
            } else {
              currentLink = req.url + `&page=${pageInput}`;
            }
          }
        }
      }
      res.render('list', { rows: data, page: totalPage, currentPage: pageInput, query: req.query, link: req.url, currentUrl: currentLink });
    });
  });
});
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  writeDb(req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean);
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  indexList((rows) => {
    data = rows;
    res.render('edit', { item: data[req.params.id - 1], index: parseInt(req.params.id) });
  });
});

app.post('/edit/:id', (req, res) => {
  updateDb(req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean, parseInt(req.params.id));
  res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
  deleteDb(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
