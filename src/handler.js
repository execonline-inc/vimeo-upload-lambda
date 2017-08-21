import VimeoUploadLambda from './VimeoUploadLambda';
require('dotenv').config();
import jf from 'jsonfile';
import mysql from 'mysql';

function processSNS(event) {
  let message = event.Records[0].Sns.Message;
  //can we use jsonous here instead?
  message = JSON.parse(message)
  return message;
}

function entry(event, context, callback) {
  const message = processSNS(event)
  vimeoProcess(message);
  callback(null, 'Success!');
}

function test() {
  const v = new VimeoUploadLambda();
  const event = jf.readFileSync('event.json');
  const message = processSNS(event);
  v.vimeoProcess(message);
}


module.exports = {
  entry,
  test,
};
