const express = require('express');
const path = require('path')
var bodyParser = require('body-parser');
const app = express();
const data = []
const port = 3000;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('.'));


app.get('/', (req, res) => {
  res.render('list', { data });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
    console.log(req.body)
    data.push({String: req.body.String, Integer: req.body.Integer, Float: req.body.Float, Date: req.body.Date, Boolean: req.body.Boolean})
    res.redirect('/')
})

app.get('/delete/:id', (req, res) => {
  const index = req.params.id
  data.splice(index, 1)
  res.redirect('/');
})

app.get('/edit/:id', (req, res) => {
  const index = req.params.id;
  res.render('edit',{item: data[index]});
});

app.post('/edit/:id', (req, res) => {
  const index = req.params.id;
  data[index] = { String: req.body.String, Integer: req.body.Integer, Float: req.body.Float, Date: req.body.Date, Boolean: req.body.Boolean };
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});