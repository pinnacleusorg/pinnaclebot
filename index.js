const express = require('express')
const SlackBot = require('./SlackBot');
const app = express()
const port = 8080

var thisParser = new SlackBot("");

app.use(thisParser.parse);
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
