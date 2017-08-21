# vimeo-upload-lambda
Use this boilerplate to get started creating your next Lambda function with Node.js

## Installation

Install Node

```
nvm install
```

`yarn install`

## Usage
vimeo-upload-lambda is ES6 ready.  Functions in handler.js will execute. `serverless deploy` deploys function to AWS.

## Deployment

When deploying with serverless, you can set different stages that you want to deploy to.
The stage name will be added to the service name. e.g if service name is `vimeo-upload-lambda`, when you run

`SLS_DEBUG='*' serverless deploy --stage development --verbose`,

the Lambda will be deployed as  `vimeo-upload-lambda-development`.

This is great if you want to have the same lambda but with different
configuration for environments e.g staging and production

`vimeo-upload-lambda-staging`, `vimeo-upload-lambda-production`

If you don't specify a stage, serverless adds the dev stage to it
by default so if you run `serverless deploy`, what you get is `vimeo-upload-lambda-dev`

## What happens if I want to deploy with just a name?

Assuming you want your lambda name to be named `vimeo-upload-lambda`
because it's the same lambda that is used for all environments,

Then you can edit your `serverless.yml` file with this

```
  service: vimeo-upload
  stage: lambda
```

So if you run `serverless deploy`, your lambda will be deployed as `report-virus-lambda`

or you can set your service as `report-virus` in the `serverless.yml` file and
run `SLS_DEBUG='*' serverless deploy --stage lambda --verbose`


## Development
1. Test your function locally in a node console before attempting to deploy
1. `SLS_DEBUG='*' serverless webpack invoke --function test` to test with serverless locally.  You may need to set SLS_DEDUG: `export SLS_DEBUG='*'`
