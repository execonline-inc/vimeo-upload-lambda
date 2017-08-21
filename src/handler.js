import VimeoUploadLambda from './VimeoUploadLambda';
require('dotenv').config();
import jf from 'jsonfile';

function processSNS(event) {
  let message = event.Records[0].Sns.Message;
  message = JSON.parse(message);
  return message;
}

function entry(event, context, callback) {
  const message = processSNS(event);
  new VimeoUploadLambda().vimeoProcess(message);
  callback(null, 'Success!');
}

function test() {
  const event = jf.readFileSync('event.json');
  const message = processSNS(event);
  new VimeoUploadLambda().vimeoProcess(message);
}

module.exports = {
  entry,
  test,
};
