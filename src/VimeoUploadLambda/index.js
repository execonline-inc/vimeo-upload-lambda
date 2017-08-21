import mysql from 'mysql';
import req from 'request';

const uploadToVimeo = (message) => {
  console.log("uploadToVimeo", message)
  const videoLink = 'https://s3.amazonaws.com/' +
        process.env.AWS_ENVIRONMENT_BUCKET + "/" +
        message['outputKeyPrefix'] +
        message['outputs'][0]['key'];

  console.log("Uploading " + videoLink + " to Vimeo");
  req({
    url: 'https://api.vimeo.com/me/videos',
    method: 'POST',
    json: true,
    body: {
      type: 'pull',
      link: videoLink
    },
    headers: {
      'Authorization': 'bearer ' + process.env.VIMEO_API_TOKEN
    }
  }, function (error, response, body) {
    if (error) {
      throw('upload failed:', error);
    } else {
      var vimeoId = parseInt(body.uri.match(/\d+/)[0]);

      if(isNaN(vimeoId)){
        throw('invalid vimeo id:', vimeoId);
      }else{
        updateAsset(message, vimeoId);
      }

    }
  });
}

const updateAsset = (message, vimeoId) => {
  const key = message.input.key;
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  const query = 'UPDATE content_library_assets SET vimeo_id = ?  WHERE tmp_video = ? ';
  connection.connect();

  connection.query(query, [vimeoId, key], (err, result) => {
    if (err) throw err;
  });

  connection.end();
}

class VimeoUploadLambda {
  vimeoProcess = (message) => {
    const videoUrl = message['outputs'][0]['key'];
    if (videoUrl)  {
      if (videoUrl.match(/.*high.mp4/)) {
        uploadToVimeo(message);
      } else {
        console.log('wrong video type!');
      }
    } else {
      console.log('missing path to video file, unable to upload');
    }
  }
}

export default VimeoUploadLambda;
