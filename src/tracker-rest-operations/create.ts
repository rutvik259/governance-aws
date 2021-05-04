import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/** processingDate, startTime, overTime, installerName, types, taskType, incidentNumber, faxNumber, sendersEmailId, comment*/

/* Create a Report */
export function createTrackerReport (processingDate:number, startTime:number, overTime:boolean, installerName:string, types:string, taskType:string, incidentNumber:number, faxNumber:number, sendersEmailId:string, comment:string) {
    //For adding the created-date
    const timestamp = new Date().getTime();
    //Information about the table, and the input we want to give.
    const params = {
        TableName: process.env.TRACKER_TABLE,
        Item:{
            id:uuid(),
            processingDate: processingDate,
            startTime,
            overTime,
            installerName,
            types,
            taskType,
            incidentNumber,
            faxNumber,
            sendersEmailId,
            comment,
            createdAt:timestamp,
            updatedAt:timestamp
        }
    }
    console.log(params)
    return dynamodb
            .put(params)
            .promise()
            .then(res=>res)
            .catch(err=>err)
}
