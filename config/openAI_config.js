import OpenAI from 'openai';
import dotenv from 'dotenv'
dotenv.config()

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

export const openai = new OpenAI(configuration);