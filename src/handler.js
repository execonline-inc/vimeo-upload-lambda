import VimeoUploadLambda from './VimeoUploadLambda';
require('dotenv').config();
import jf from 'jsonfile';

const entry = (event, context, callback) => {
  new VimeoUploadLambda().vimeoProcess(event);
  callback(null, 'Success!');
}

const test = e => {
  new VimeoUploadLambda().vimeoProcess(jf.readFileSync('event.json'));
}

module.exports = {
  entry,
  test,
};
