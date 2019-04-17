/*!
 * Queuem, http://tpkn.me/
 */
const EventEmitter = require('events').EventEmitter;

class Queuem extends EventEmitter {
   constructor() {
      super();

      this.current;
      this.queue = [];
      this.processing = 0;
      this._concurrent = 1;
   }

   /**
    * Add new task in a queue
    * @param {Function} task
    */
   add(task, ...args) {
      this.emit('+1');
      this.emit('change', { type: '+1', error: null, data: null });
      this.queue.push({ task, args });
      this.queueChanged();
   }

   /**
    * Start the next task in a queue
    */
   runTask() {
      if (this.queue.length > 0) {
         this.processing++;

         this.current = this.queue.shift();
         this.current.task.apply(null, this.current.args)
         .then(data => {
            this.taskDone(null, data);
         })
         .catch(err => {
            this.taskDone(err, null);
         });
      }
   }

   /**
    * Some task has been completed right now
    * @param  {Object} data
    */
   taskDone(error, data) {
      this.emit('-1', { error, data });
      this.emit('change', { type: '-1', error, data });
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
