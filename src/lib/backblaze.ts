import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
});

export { s3 };
