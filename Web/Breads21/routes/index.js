var express = require('express');
var router = express.Router();
const moment = require('moment');

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    const url = req.url == '/' ? '/?page=1' : req.url;
    //searching
    const params = [];
    const values = [];
    let counter = 1;

    if (req.query.name) {
      params.push(` name ilike '%' || $${counter++} || '%'`);
      values.push(req.query.name);
    }

    if (req.query.scores) {
      params.push(` scores = $${counter++}`);
      values.push(req.query.scores);
    }

    if (req.query.grade) {
      params.push(` grade = $${counter++}`);
      values.push(req.query.grade);
    }

    if (req.query.date) {
      params.push(` date = $${counter++}`);
      values.push(req.query.date);
    }

    if (req.query.condition) {
      params.push(` condition = $${counter++}`);
      values.push(req.query.condition);
    }

    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    let sql = ` SELECT COUNT(*) AS total FROM exam `;
    if (params.length > 0) sql += ` WHERE ${params.join(' AND ')}`;

    db.query(sql, values, (err, data) => {
      if (err) return res.send(err);
      const total = data.rows[0].total;
      const pages = Math.ceil(total / limit);

      sql = ` SELECT * FROM exam`;
      if (params.length > 0) sql += ` WHERE ${params.join(' AND ')}`;

      sql += ` LIMIT $${counter++} OFFSET $${counter++}`;
      db.query(sql, [...values, limit, offset], (err, data) => {
        if (err) return res.send(err);
        res.render('list', { data: data.rows, page, pages, offset, query: req.query, url, moment });
      });
    });
  });

  router.get('/add', function (req, res, next) {
    res.render('form');
  });

  router.post('/add', function (req, res, next) {
    db.query(`INSERT INTO exam (name,scores,grade,date,condition) VALUES ($1,$2,$3,$4,$5) `, [req.body.name, req.body.scores, req.body.grade, req.body.date, req.body.condition], (err, data) => {
      if (err) return res.send(err);
      res.redirect('/');
    });
  });

  router.get('/delete/:id', function (req, res, next) {
    db.query(`DELETE FROM exam WHERE id = $1`, [req.params.id], (err, data) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.redirect('/');
    });
  });

  router.get('/edit/:id', function (req, res, next) {
    db.query(`SELECT * FROM exam WHERE id =  $1 `, [req.params.id], (err, data) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.render('edit', { item: data.rows[0], moment });
    });
  });

  router.post('/edit/:id', function (req, res, next) {
    console.log(req.query.id, req.params.id, req.body.id,"Test")
    db.query(`UPDATE exam SET id = $1, name = $2, scores = $3, grade = $4, date = $5, condition = $6 WHERE id = $1`, [req.body.id, req.body.name, req.body.scores, req.body.grade, req.body.date, req.body.condition], (err, data) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.redirect('/');
    });
  });

  return router;
};