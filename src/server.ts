require("dotenv").config();
import { Request, Response } from 'express';
const express = require('express');
const bodyParser = require("body-parser");
const {getConnection} = require("./api/config/db.config.js");
const {getFeatureState} = require("./api/logic/logic");
import  {UserEnabledFeatures, FeaturesJSON, FeatureFlag} from "./api/types/types";
const fs = require('fs');
const path = require("path");

const app = express();
app.use(bodyParser.json());

const DOCKER_PORT = process.env.NODE_DOCKER_PORT || 8080;
const LOCAL_PORT = process.env.NODE_LOCAL_PORT || 6868;

/** 
 * Returns a list of feature flags enabled for a given user
 * @param {object} containing a user key where the value is a users email and location e.b., email=fred@example.com&location=GB
 * @return {string[]} an array of enabled features
 */
app.post("/getFeatureFlag", async ( req:Request, res:Response ) => {
    try {
        if ( !req.body || !('user' in req.body) ) return res.status(400).json({"success": false, "message": "Error: an empty request supplied"});

        const body = req.body.user;
        const splitBody = body.split("&");

        //Bail out if the body supplied doesn't contain 2 elements split by an ampersand (&)
        if ( splitBody.length !== 2) return res.status(400).json({"success": false, "message": "Invalid request"});

        const emailRegex = splitBody[0].match(/email\s*=\s*(.*)/) || splitBody[1].match(/email\s*=\s*(.*)/);
        const locationRegex = splitBody[1].match(/location\s*=\s*(.*)/) || splitBody[0].match(/location\s*=\s*(.*)/);

        //Check if the request has valid arguments
        if ( !emailRegex || !locationRegex || !emailRegex.length || !locationRegex.length || !emailRegex[1] || !locationRegex[1]){
            return res.status(400).json({"success": false, "message": "Invalid request arguments"});
        }

        const userEmail = emailRegex[1].replace(/\s+/g, '');
        const userLocation = locationRegex[1].replace(/\s+/g, '');

        console.log("email: ", userEmail);
        console.log("location: ", userLocation);

        //Get the database connection
        const {connection, query} = await getConnection();

        //Query the database for previously enabled features
        const featureFlagQuerySql = `
            SELECT
                featureFlagFeature AS 'Feature',
                featureFlagOptionState AS 'State'
            FROM user
                LEFT JOIN featureFlagOption USING (userID)
                LEFT JOIN featureFlag USING (featureFlagID)
            WHERE userEmail = ?`;

        const featureFlagQuery:Array<UserEnabledFeatures> = await query(featureFlagQuerySql, [userEmail]);

        if ( featureFlagQuery.length ){
            //If the user has previously had features enabled/disabled return those

            const enabledFeatures = featureFlagQuery.filter(featureObj => featureObj.State).map(feature => feature.Feature);

            connection.release();
            return res.status(200).json({"success": true, "enabledFeatures": enabledFeatures});
        } else {
            const featuresJSON:Array<FeaturesJSON> = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'features.json'), {encoding:'utf8'}));

            const enabledFeatures = featuresJSON.map(featureObj => {
                //Check if the email is included in the enabledEmails array
                if ( featureObj.enabledEmails.includes(userEmail) ) return featureObj.name;

                //Check if the location is included or the array blank else return null
                if ( !(featureObj.includedCountries.includes(userLocation)) && !(featureObj.includedCountries.length === 0)) return null;

                //Use the feature flag ratio to determine if the feature is enabled or not
                return getFeatureState(featureObj.ratio) ? featureObj.name : null;
            }).filter(Boolean);

            //Insert user
            const userInsertQuery = await query('INSERT INTO user (userEmail) VALUES (?)', [userEmail]);
            const userID = userInsertQuery.insertId;

            const allFeatureNames = featuresJSON.map(feature => feature.name);

            const featureFlagLookupQuery:Array<FeatureFlag> = await query('SELECT featureFlagID, featureFlagFeature FROM featureFlag WHERE featureFlagFeature in (?)', [allFeatureNames]);

            const featureFlagOptionValues = featureFlagLookupQuery.map(feature => {
                const featureState = enabledFeatures.includes(feature.featureFlagFeature) ? 1 : 0;
                
                return [userID, feature.featureFlagID, featureState];
            })

            await query('INSERT INTO featureFlagOption (userID, featureFlagID, featureFlagOptionState) VALUES ?', [featureFlagOptionValues]);

            console.log("query: ", await query('SELECT * FROM featureFlagOption WHERE userID = ? ', [userID]));

            connection.release();
            return res.status(200).json({"success": true, "enabledFeatures": enabledFeatures});
        }
    } catch ( e ) {
        console.error(e);
        return res.status(500).json({"success": false, "message": "Error: A server error occured, please try again"});
    }
});


app.listen(DOCKER_PORT, () => {
    console.log(`server running on http://localhost:${ LOCAL_PORT }`);
});