import { Paddle, Environment } from '@paddle/paddle-node-sdk';

export const paddle = new Paddle(
  process.env.PADDLE_API_KEY || 'dummy_key_for_build',
  {
    environment: process.env.PADDLE_ENV === 'production'
      ? Environment.production
      : Environment.sandbox,
  }
);
