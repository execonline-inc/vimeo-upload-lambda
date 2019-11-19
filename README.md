# vimeo-upload-lambda

AWS Lambda Function that Uploads Videos to Vimeo using the Vimeo API

## Prerequisites

Nodejs
[nvm](https://github.com/nvm-sh/nvm)
[serverless](https://github.com/serverless/serverless)

## Setup

```bash
nvm use
yarn
```

## Usage

vimeo-upload-lambda is ES6 ready. Functions in handler.js will execute.

## Deployment

The current workflow follows these [General Guidelines](https://execonline.atlassian.net/wiki/spaces/TEC/pages/964140/Development+Workflow#DevelopmentWorkflow-Generalprinciples)

_Merge flow_:

```bash
feature_branch -> staging --> master --> production

cherry-pick from your feature_branch to staging
once ready, merge PR to master
then, reset production to master and manually deploy to production
```

```bash
branch          stage/environment    notes

feature_branch  local                test locally using serverless invoke local (limited testing)

staging         staging              deploy manually

master          noop

production      production           deploy manually
```

### To deploy

```bash

# staging
SLS_DEBUG='*' serverless deploy --stage staging --verbose

# prodution
SLS_DEBUG='*' serverless deploy --stage production --verbose

```

## Development

1. Test your function locally in a node console before attempting to deploy

```bash

SLS_DEBUG='*' serverless webpack invoke --function test

```

Note that you may need to set SLS_DEDUG: `export SLS_DEBUG='*'`

## About Serverless Deploy

`serverless deploy` deploys function to AWS.
When deploying with serverless, you can set different stages that you want to deploy to.
The stage name will be added to the service name. e.g if service name is `vimeo-upload-lambda`, when you run

`SLS_DEBUG='*' serverless deploy --stage development --verbose`,

the Lambda will be deployed as `vimeo-upload-lambda-development`.

This is great if you want to have the same lambda but with different
configuration for environments e.g staging and production

`vimeo-upload-lambda-staging`, `vimeo-upload-lambda-production`

If you don't specify a stage, serverless adds the dev stage to it
by default so if you run `serverless deploy`, what you get is `vimeo-upload-lambda-dev`

## What happens if I want to deploy with just a name?

Assuming you want your lambda name to be named `vimeo-upload-lambda`
because it's the same lambda that is used for all environments,

Then you can edit your `serverless.yml` file with this

```bash

service: vimeo-upload
stage: lambda

```

So if you run `serverless deploy`, your lambda will be deployed as `report-virus-lambda`

or you can set your service as `report-virus` in the `serverless.yml` file and
run `SLS_DEBUG='*' serverless deploy --stage lambda --verbose`
