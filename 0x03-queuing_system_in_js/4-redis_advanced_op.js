#!/usr/bin/yarn dev
import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

/**
 * Using hset, let’s store the following:
 * The key of the hash should be HolbertonSchools.
 * Make sure you use redis.print for each hset
 */
client.HSET('HolbertonSchools', 'Portland', 50, print);
client.HSET('HolbertonSchools', 'Seattle', 80, print);
client.HSET('HolbertonSchools', 'New York', 20, print);
client.HSET('HolbertonSchools', 'Bogota', 20, print);
client.HSET('HolbertonSchools', 'Cali', 40, print);
client.HSET('HolbertonSchools', 'Paris', 2, print);

client.HGETALL('HolbertonSchools', (_err, result) => {
  console.log(result);
});
