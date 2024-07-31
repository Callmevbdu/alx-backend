#!/usr/bin/yarn dev
import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

/**
 * It accepts two arguments schoolName, and value.
 * It should set in Redis the value for the key schoolName
 * It should display a confirmation message using redis.print
 */
const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print);
};

/**
 * It accepts one argument schoolName.
 * It should log to the console the value for the key passed as argument
 */
const displaySchoolValue = (schoolName) => {
  client.GET(schoolName, (_err, value) => {
    console.log(value);
  });
}

/**
 * Call the functions
 */
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
