import mysql from 'mysql';
import req from 'request';

const uploadToVimeo = (bucket, video) => {
  const videoLink = `${getCloudfrontName(bucket)}/${video}`;
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
      updateAsset(vimeoId, video);
    },
  );
};

const getCloudfrontName = (bucket) => {
  `https://${bucket.replace('execonline-', '')}.execonline.com`
}

const updateAsset = (vimeoId, video) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  const query =
    'UPDATE content_library_assets SET vimeo_id = ?  WHERE tmp_video = ? ';
  connection.connect();

  connection.query(query, [vimeoId, video], (err, result) => {
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
    const bucket = message.Records[0].s3.bucket.name;
    const video = message.Records[0].s3.object.key;
    if (!bucket) throw 'bucket name is missing, unable to upload!';
    if (!video) throw 'video name is missing, unable to upload!';
    uploadToVimeo(bucket, video);
  };
}

export default VimeoUploadLambda;
