import express from 'express'

const app = express();

app.get('/', (req, res) => {
  return res.json({
    message: "Hello Websocket"
  })
})

app.listen(3000, () => {
  console.log("App is running on port 3000🚀")
})