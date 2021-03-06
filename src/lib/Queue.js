import Bee from 'bee-queue';
import redisConfig from '../config/redis';

import AnswerMail from '../app/jobs/AnswerMail';

import ConfirmationMail from '../app/jobs/ConfirmationMail';

const jobs = [AnswerMail, ConfirmationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle,
      };
    });
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue: ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
