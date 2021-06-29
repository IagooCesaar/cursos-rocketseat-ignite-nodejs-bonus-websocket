import express from 'express'
import { createServer } from 'http'

const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
  return res.json({
    message: "Hello Websocket"
  })
})

server.listen(3000, () => {
  console.log("App is running on port 3000🚀")
})