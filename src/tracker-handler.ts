import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import 'source-map-support/register';
import { createTrackerReport } from './tracker-rest-operations';

export const createReport: APIGatewayProxyHandler = async (
    event: APIGatewayEvent,
    context: Context) => {
        console.log("EVENT BODY >>>>>" + event.body);
        
        //Taking the incoming event-body and stroing it into a const 
        const incoming : {  
                            processingDate:number; 
                            startTime:number; 
                            overTime:boolean; 
                            installerName:string; 
                            types:string; 
                            taskType:string; 
                            incidentNumber:number; 
                            faxNumber:number; 
                            sendersEmailId:string; 
                            comment:string   
                        } = JSON.parse(event.body);
        const { processingDate, startTime, overTime, installerName, types, taskType, incidentNumber, faxNumber, sendersEmailId, comment} = incoming;
        try{
            await createTrackerReport(processingDate, startTime, overTime, installerName, types, taskType, incidentNumber, faxNumber, sendersEmailId, comment);
            return buildResponse({created: incoming}, 201);
        } catch (err) {
            console.log("Error >>>" + err);
            return buildResponse(err, 400);
        }
    };

    export const buildResponse = (fulfillmentText: any, statusCode: number): any => {
        return {
            statusCode,
            body: JSON.stringify(fulfillmentText),
            headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
            }
        };
    }