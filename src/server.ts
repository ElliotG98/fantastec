require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const {getConnection} = require("./api/config/db.config.js");
import { Request, Response } from 'express';

const app = express();
app.use(bodyParser.json());

const DOCKER_PORT = process.env.NODE_DOCKER_PORT || 8080;
const LOCAL_PORT = process.env.NODE_LOCAL_PORT || 6868;


app.post("/getFeatureFlag", async ( req:Request, res:Response ) => {
    console.log(req.body);

    try{
        const {connection, query} = await getConnection();
        const testQuery = await query('SELECT * FROM user');
        console.log(testQuery);
    }catch (e){
        console.error(e);
        res.json(500).json({"success":false});
    }

    res.status(200).json({"success": true});
})

app.listen(DOCKER_PORT, () => {
    console.log(`server running on http://localhost:${ LOCAL_PORT }`);
})