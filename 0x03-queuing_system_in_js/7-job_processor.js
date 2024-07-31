#!/usr/bin/yarn dev
import { createQueue, Job } from 'kue';

/**
 * Create an array that will contain the blacklisted phone numbers. Add in it
 * 4153518780 and 4153518781 - these 2 numbers will be blacklisted by our jobs
 * processor.
 */
const BLACKLISTED_NUMBERS = ['4153518780', '4153518781'];
const queue = createQueue();

/**
 * Create a function sendNotification that takes 4 arguments: phoneNumber,
 * message, job, and done:
 * 	- When the function is called, track the progress of the job of 0 out
 * 	of 100
 * 	- If phoneNumber is included in the “blacklisted array”, fail the job
 * 	with an Error object and the message: Phone number PHONE_NUMBER is
 * 	blacklisted
 * 	- Otherwise:
 * 		+ Track the progress to 50%
 * 		+ Log to the console Sending notification to PHONE_NUMBER, with
 * 		message: MESSAGE
 */
const sendNotification = (phoneNumber, message, job, done) => {
  let total = 2, pending = 2;
  let sendInterval = setInterval(() => {
    if (total - pending <= total / 2) {
      job.progress(total - pending, total);
    }
    if (BLACKLISTED_NUMBERS.includes(phoneNumber)) {
      done(new Error(`Phone number ${phoneNumber} is blacklisted`));
      clearInterval(sendInterval);
      return;
    }
    if (total === pending) {
      console.log(
        `Sending notification to ${phoneNumber},`,
        `with message: ${message}`,
      );
    }
    --pending || done();
    pending || clearInterval(sendInterval);
  }, 1000);
};

/**
 * Create a queue with Kue that will proceed job of the queue
 * push_notification_code_2 with two jobs at a time.
 */
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
