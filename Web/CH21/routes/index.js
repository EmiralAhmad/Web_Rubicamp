var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    const url = req.url == '/' ? '/?page=1' : req.url


    //searching
    const params = []
    const values = []
    let counter = 1

    if(req.query.title) {
      params.push(`title ilike '%' || $${counter++} || '%'`)
      values.push(req.query.title)
    }

    if (req.query.complete) {
      params.push(`complete = $${counter++}`)
      values.push(req.query.complete)
    }

    const page = req.query.page || 1
    const limit = 3
    const offset = (page -1) * limit


    let sql = `SELECT COUNT(*) AS total FROM todos `;
    if (params.length > 0)
    sql += ` WHERE ${params.join(' AND ')} `
    console.log(sql)
    db.query(sql, values,(err,data) => {
      if (err) return res.send(err)
      const total = data.rows[0].total
      const pages = Math.ceil(total / limit)

      sql = `SELECT * FROM todos`
      if (params.length > 0) 
      sql += ` WHERE ${params.join(' AND ')} `

    sql += ` LIMIT $${counter++} OFFSET $${counter++} `
    console.log(sql)
    db.query(sql,[...values,limit,offset],(err, data) => {
      if (err) return res.send(err)
      res.render('list', { data: data.rows, page, pages, offset, query: req.query, url });
    });
  })
  });

  router.get('/add', function (req, res, next) {
    res.render('form');
  });

  router.post('/add', function (req, res, next) {
    db.query(`INSERT INTO todos (title, complete) VALUES ($1, $2)`, [req.body.title, req.body.complete],(err, data) => {
      if (err) return res.send(err);
      res.redirect('/');
    });
  });

  router.get('/delete', (req, res) => {
    const values = req.params.id;
    data.splice(values, 1);
    res.redirect('/');
  });

  router.get('/edit', (req, res) => {
    const values = req.params.id;
    res.render('form', { item: data[values] });
  });

  router.post('/edit/:id', (req, res) => {
    const index = req.params.id;
    data[index] = { title: req.body.title, complete: req.body.complete };
    res.redirect('/');
  });



  
  return router;
};
