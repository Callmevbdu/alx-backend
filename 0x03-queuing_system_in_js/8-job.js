#!/usr/bin/yarn dev
import { Queue, Job } from 'kue';

/**
 * Create a function named createPushNotificationsJobs:
 * - It takes into argument jobs (array of objects), and queue (Kue queue)
 * - If jobs is not an array, it should throw an Error with message: Jobs is
 *   not an array
 * - For each job in jobs, create a job in the queue push_notification_code_3
 * - When a job is created, it should log to the console Notification job
 *   created: JOB_ID
 * - When a job is complete, it should log to the console Notification job
 *   JOB_ID completed
 * - When a job is failed, it should log to the console Notification job JOB_ID
 *   failed: ERROR
 * - When a job is making progress, it should log to the console Notification
 *   job JOB_ID PERCENT% complete
 */
export const createPushNotificationsJobs = (jobs, queue) => {
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }
  for (const jobInfo of jobs) {
    const job = queue.create('push_notification_code_3', jobInfo);

    job
      .on('enqueue', () => {
        console.log('Notification job created:', job.id);
      })
      .on('complete', () => {
        console.log('Notification job', job.id, 'completed');
      })
      .on('failed', (err) => {
        console.log('Notification job', job.id, 'failed:', err.message || err.toString());
      })
      .on('progress', (progress, _data) => {
        console.log('Notification job', job.id, `${progress}% complete`);
      });
    job.save();
  }
};

export default createPushNotificationsJobs;
