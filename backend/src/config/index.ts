import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/footballstaitsboard',
  externalApiToken: process.env.EXTERNAL_API_TOKEN || '',
};
