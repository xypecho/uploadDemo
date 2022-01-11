const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/upload', (req, res) => {
    console.log(req);
    console.log(res);
    res.send('上传成功')
})

app.post('/merge', (req, res) => {
    res.send('开始合并')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})