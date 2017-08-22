import mysql from 'mysql';
import req from 'request';

const uploadToVimeo = message => {
  const videoLink =
    'https://s3.amazonaws.com/' +
    process.env.AWS_ENVIRONMENT_BUCKET +
    '/' +
    message['outputKeyPrefix'] +
    message['outputs'][0]['key'];
  console.log("uploading " + videoLink + " to vimeo")
  req(
    {
      url: 'https://api.vimeo.com/me/videos',
      method: 'POST',
      json: true,
      body: {
        type: 'pull',
        link: videoLink,
      },
      headers: {
        Authorization: 'bearer ' + process.env.VIMEO_API_TOKEN,
      },
    },
    (err, response, body) => {
      if (err) throw ('upload failed: ', err);
      let vimeoId = '';
      if (body.uri) {
        vimeoId = parseInt(body.uri.match(/\d+/)[0]);
      } else {
        console.log('vimeoId unavailable:', body);
      }
      if (isNaN(vimeoId)) throw ('invalid vimeo id:', vimeoId);
      updateAsset(message, vimeoId);
    },
  );
};

const updateAsset = (message, vimeoId) => {
  console.log("updating asset row with vimeoId: ", vimeoId)
  const key = message.input.key;
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  const query =
    'UPDATE content_library_assets SET vimeo_id = ?  WHERE tmp_video = ? ';
  connection.connect();

  connection.query(query, [vimeoId, key], (err, result) => {
    if (err) throw err;
    console.log(`updated ${result.affectedRows} rows`);
  });

  connection.end();
};

const processSNS = event => {
  const message = event.Records[0].Sns.Message;
  return JSON.parse(message);
}

class VimeoUploadLambda {
  vimeoProcess = event => {
    const message = processSNS(event);
    const videoUrl = message['outputs'][0]['key'];
    console.log("starting vimeo processing, videoUrl: ", videoUrl)

    if (!videoUrl) throw 'missing path to video file, unable to upload!';
    if (videoUrl.match(/.*high.mp4/)) {
      uploadToVimeo(message);
    } else {
      console.log('wrong video type! exiting')
    }
  };
}

export default VimeoUploadLambda;
