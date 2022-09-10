var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = function (db) {
  const collection = db.collection('users');

  router.get('/', async function (req, res, next) {
    try {
      //searching
      const {name, scores, grade, date, condition} = req.query
      const params = {}
      if(name){
        params['name'] = new RegExp(name, 'i')
      }

      if (scores) {
          params['scores'] = scores;
      }

      if (grade) {
        params['grade'] = grade;
      }

      if (date) {
        params['date'] = date;
      }

      if (condition) {
        params['condition'] = condition;
      }


      const page  = req.query.page || 1
      const limit = 5
      const offset = (page - 1) * limit
      const total = await collection.countDocuments(params)
      const pages = Math.ceil(total / limit)
      const findResult = await collection.find(params).limit(limit).skip(offset).toArray();
      const sortBy = req.query.sortBy || '_id'
      const sortMode = req.query.sortMode || 'asc'
      res.status(200).json({
        data: findResult,
        page: parseInt(page),
        pages: pages,
        sortBy: sortBy,
        sortMode: sortMode,
        offset
      });
    } catch (e) {
      console.log(e)
      res.json(e);
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const insertResult = await collection.insertOne({ name: req.body.name, scores: req.body.scores, grade: req.body.grade, date: req.body.date, condition: req.body.condition });
      res.status(201).json(insertResult);
    } catch (e) {
      res.json(e);
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne({ _id: ObjectId(req.params.id) }, { $set: { name: req.body.name, scores: req.body.scores, grade: req.body.grade, date: req.body.date, condition: req.body.condition } });
      res.status(201).json(updateResult);
    } catch (e) {
      res.json(e);
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const deleteResult = await collection.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(201).json(deleteResult);
    } catch (e) {
      res.json(e);
    }
  });

  return router;
};
