#!/usr/bin/yarn dev
import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server', err.toString());
});

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});

/**
 * It accepts two arguments schoolName, and value.
 * It should set in Redis the value for the key schoolName
 * It should display a confirmation message using redis.print
 */
const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print);
};

const getAsync = promisify(client.GET).bind(client);

/**
 * It accepts one argument schoolName.
 * It retrieves the value for the key passed as an argument using async/await.
 */
const displaySchoolValue = async (schoolName) => {
  console.log(await getAsync(schoolName));
};

/**
 * Call the functions
 */
async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}
