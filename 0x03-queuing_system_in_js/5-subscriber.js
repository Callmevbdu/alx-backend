#!/usr/bin/yarn dev
import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.SUBSCRIBE('holberton school channel');

client.on('message', (channel, message) => {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    client.UNSUBSCRIBE('holberton school channel');
    client.quit();
  }
});
