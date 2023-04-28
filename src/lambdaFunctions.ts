import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
})

type SendGridPayload = {
  to: string
  from: string
  template_id: string | undefined
  dynamic_template_data: {
      results: JSX.Element | { amazonUrl: string; idea: string; }[]
  }
}

export const invokeLambdaFunction = (functionName: string, payload: SendGridPayload) => {
  const lambda = new AWS.Lambda();
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload)
  }
  return lambda.invoke(params).promise();
}