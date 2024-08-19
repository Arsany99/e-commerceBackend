import dotenv from "dotenv"
import path from 'path'
dotenv.config({path:path.resolve('config/.env')})

import express from 'express'
import { initApp } from "./src/initApp.js"
const app = express()
const port = process.env.PORT || 3001
initApp(app , express)



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

