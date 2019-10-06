/*!
 * Queuem, http://tpkn.me/
 */
const EventEmitter = require('events').EventEmitter;
const Events = {
   TASK_ADDED    : 'added',
   TASK_DONE     : 'done',
   QUEUE_CHANGED : 'changed',
   QUEUE_EMPTY   : 'empty',
}

class Queuem extends EventEmitter {
   constructor(options = {}) {
      super();

      let {
         parallel = 1,
         emptyDelay = 0,
      } = options;

      // Make some variables non-enumerable
      Object.defineProperty(this, '_tid', { writable: true });
      Object.defineProperty(this, '_parallel', { writable: true, value: 1 });
      Object.defineProperty(this, '_emptyDelay', { writable: true, value: 0 });

      this.queue = [];
      this.processing = 0;
      this.parallel = parallel;
      this.emptyDelay = emptyDelay;
   }


   /**
    * @param {Function} task
    * @param {Any}      data
    */
   append(task, data) {
      this._addTask(task, data);
   }

   prepend(task, data) {
      this._addTask(task, data, { prepend: true });
   }


   /**
    * Get/set the amount of parallel tasks
    */
   get parallel() {
      return this._parallel;
   }

   set parallel(value) {
      if (typeof value === 'number' && value >= 1 && this._parallel !== value) {
         this._parallel = Math.floor(value);

         let p = this.processing;
         while (p < this._parallel) {
            this._nextTask();
            p++;
         }
      }
   }


   /**
    * Get/set 'empty' event delay
    */
   get emptyDelay() {
      return this._emptyDelay;
   }

   set emptyDelay(value) {
      if (typeof value === 'number' && value >= 0) {
         this._emptyDelay = value;
      }
   }


   /**
    * Append/prepend new task to the queue
    * 
    * @param   {Function}   task      
    * @param   {Any}        data      
    * @param   {Object}     options   
    */
   _addTask(task, data, options = {}) {
      if (typeof task !== 'function') {
         throw new TypeError('First argument should be a Function')
      }

      let { prepend } = options;

      if (prepend) {
         this.queue.unshift({ task, data });
      } else {
         this.queue.push({ task, data });
      }

      this.emit(Events.QUEUE_CHANGED, { action: Events.TASK_ADDED });
      this.emit(Events.TASK_ADDED);
      this._queueChanged();
   }

   _nextTask() {
      if (this.queue.length > 0) {
         this.processing++;

         let { data, task } = this.queue.shift();
         task.call(null, (...args) => this._taskDone.apply(this, args), data, task);
      }
   }

   _taskDone(result) {
      this.processing--;

      this.emit(Events.QUEUE_CHANGED, { action: Events.TASK_DONE });
      this.emit(Events.TASK_DONE, result);
      this._queueChanged();
   }

   _queueChanged() {
      if (this._tid) {
         clearTimeout(this._tid);
         this._tid = null;
      }

      if (this.queue.length == 0 && this.processing == 0) {
         if (this._emptyDelay) {
            this._tid = setTimeout(() => {
               this._tid = null;
               this.emit(Events.QUEUE_EMPTY);
            }, this._emptyDelay)
         } else {
            this.emit(Events.QUEUE_EMPTY);
         }
      }

      if (this.processing < this._parallel && this.queue.length > 0) {
         this._nextTask();
      };
   }
}

module.exports = Queuem;
