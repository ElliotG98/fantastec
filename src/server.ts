require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
import { Request, Response } from 'express';

const app = express();
app.use(bodyParser.json());
const port = process.env.NODE_DOCKER_PORT || 8080;

app.post("/getFeatureFlag", ( req:Request, res:Response ) => {
    console.log(req.body);
    res.status(200).json({"success": true});
})

app.listen(port, () => {
    console.log(`server running on http://localhost:${ port }`);
})