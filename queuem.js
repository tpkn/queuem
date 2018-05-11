/*!
 * Queuem, http://tpkn.me/
 */

const EventEmitter = require('events').EventEmitter;

class Queuem extends EventEmitter {
   constructor() {
      super();

      this.task;
      this.queue = [];
      this.processing = 0;
      this._concurrent = 1;
   }

   /**
    * Add new task in a queue
    * @param {Function} task
    */
   add(task) {
      this.emit('task_added', {});
      this.queue.push(task);
      this.queueChanged();
   }

   /**
    * Start the next task in a queue
    */
   runTask() {
      if (this.queue.length > 0) {
         this.processing++;

         this.task = this.queue.shift();

         this.task().then(data => {
            this.taskDone(null, data);
         }).catch(err => {
            this.taskDone(err, null);
         })
      }
   }

   /**
    * Some task has been completed right now
    * @param  {Object} result
    */
   taskDone(err, result) {
      this.emit('task_done', { result: result, err: err });
      this.processing--;
      this.queueChanged();
   }

   /**
    * Something just changed
    */
   queueChanged() {
      if (this.queue.length == 0 && this.processing == 0) {
         this.emit('complete');
      }

      if (this.processing < this._concurrent && this.queue.length > 0) {
         this.runTask();
      };
   }

   /**
    * Set amount of concurrent tasks
    * @param  {Number} n
    */
   set concurrent(n) {
      if (typeof n === 'number' && n > 0 && this._concurrent !== n) {
         this._concurrent = n;

         let p = this.processing;
         while (p < this._concurrent) {
            this.runTask();
            p++;
         }
      }
   }
}

module.exports = Queuem;
