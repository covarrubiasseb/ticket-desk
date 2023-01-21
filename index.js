let express = require('express')
let app = express()
const port = 3000

app.use(express.static('www'))

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
