var express = require('express');
var router = express.Router();

module.exports = function(db){
const collection = db.collection('users');

router.get('/',async function(req, res, next) {
  try {
  const findResult = await collection.find({}).toArray();
  res.json(200).json(findResult)
  } catch (e){
    res.json(e)
  }
});

router.post('/', async function (req, res, next) {
  try {
   const insertResult = await collection.insertOne({name: req.body.name, scores: req.body.scores, grade: req.body.grade, date: req.body.date,  condition: req.body.condition});
    res.status(200).json(insertResult);
  } catch (e) {
    res.json(e);
  }
});

return router;
}