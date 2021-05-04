import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'governance-aws',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    dotenv:{
      required:{
        file:true
      }
    }
  },
  plugins: ['serverless-webpack', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region:'ap-south-1',
    iamRoleStatements:[
      {
        'Effect': 'Allow',
        'Action': [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        'Resource': 'arn:aws:dynamodb:${env:AWS_DB_REGION}:${env:AWS_ACCOUNT_ID}:table/${env:TRACKER_TABLE}'        
      },
      {
        "Effect": "Allow",
        "Action": "dynamodb:ListTables",
        "Resource": "*",
        "Condition": {}
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // Write lambda functions here.
  functions: {
    createTrackerReport:{
      handler:'src/tracker-handler.createReport',
      description:'API endpoint for creating a tracker-report',
      events:[
        {
          http:{
            method:'POST',
            path:'/trackerreports',
            cors:true
          }
        }
      ]
    }
  },

  //Resources for the database - eg - DynamoDB, S3, etc.
  resources:{
    Resources:{
      TrackerReportsTable:{
        Type: 'AWS::DynamoDB::Table',
        Properties:{ 
          TableName:'${env:TRACKER_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
          ],
          KeySchema:[
            {
              AttributeName: 'id',
              KeyType:'HASH'
            }
          ],
          ProvisionedThroughput:{
            ReadCapacityUnits: '${env:READ_CAPACITY}',
            WriteCapacityUnits: '${env:WRITE_CAPACITY}'            
          }
        }
      }

      //Add next Resource here.
    }
  }
};

module.exports = serverlessConfiguration;
