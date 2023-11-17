import { NextApiHandler } from 'next';
import formidable from 'formidable';
import { v4 } from 'uuid';
import { PassThrough } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { s3 } from '@/lib/backblaze';

const isValidMimeType = (type: string) => {
  return type === 'image/png' || type === 'image/jpeg';
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadStream = ({
  Bucket,
  Key,
  type,
}: {
  Bucket: string;
  Key: string;
  type: string;
}) => {
  const pass = new PassThrough();

  return {
    writeStream: pass,
    promise: new Upload({
      client: s3,
      params: {
        Bucket,
        Key,
        ContentType: type,
        Body: pass,
      },
    }).done(),
  };
};

const POST: NextApiHandler = async (req, res) => {
  const form = formidable({});

  const fileMeta: Record<string, string> = {};
  const id = v4();

  form.onPart = (part) => {
    console.log('on part');
    if (!part.originalFilename) {
      return;
    }

    console.log('mimetype', part.mimetype);
    if (!part.mimetype || !isValidMimeType(part.mimetype)) {
      return res.json({ fileId: '', error: 'invalid-filetype' });
    }

    fileMeta['name'] = part.originalFilename;
    fileMeta['type'] = part.mimetype;

    const { writeStream, promise } = uploadStream({
      Bucket: 'new-res-meal-review',
      Key: id,
      type: fileMeta['type'],
    });

    const pipeline = part.pipe(writeStream);

    promise
      .then((r) => {
        console.log(r);
      })
      .catch((e) => {
        console.error(e);
      });

    pipeline.on('close', () => {
      console.log('done');
      return res.json({ fileId: id });
    });

    pipeline.on('error', (e) => {
      console.log(e);
      return res.json({ error: 'unknown' });
    });
  };

  await form.parse(req);
};

export default POST;
