#!/usr/bin/yarn dev
import { createQueue } from 'kue';

/**
 * Create a queue named push_notification_code, and create a job with the
 * object created before.
 */
const queue = createQueue({name: 'push_notification_code'});

const client = queue.create('push_notification_code', {
  phoneNumber: '123-456-7890',
  message: 'Hello, world!',
});

/**
 * - When the job is created without error, log to the console Notification job
 *   created: JOB ID
 * - When the job is completed, log to the console Notification job completed
 * - When the job is failing, log to the console Notification job failed
 */
client
  .on('enqueue', () => {
    console.log('Notification job created:', client.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed', () => {
    console.log('Notification job failed');
  });
client.save();
