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
   constructor(options = {}){
      super();

      let { 
         parallel = 1
      } = options;

      this.queue = [];
      this.processing = 0;
      this._parallel = 1;
      this.parallel = parallel;
   }


   /**
    * @param {Function} task
    * @param {Any}      data
    */
   append(task, data){
      this._addTask(task, data);
   }

   prepend(task, data){
      this._addTask(task, data, { prepend: true });
   }


   /**
    * Get/set the amount of parallel tasks
    */
   get parallel(){
      return this._parallel;
   }

   set parallel(value){
      if (typeof value === 'number' && value >= 1 && this._parallel !== value){
         this._parallel = Math.floor(value);

         let p = this.processing;
         while (p < this._parallel){
            this._nextTask();
            p++;
         }
      }
   }


   /**
    * Append/prepend new task to the queue
    * 
    * @param   {Function}   task      
    * @param   {Any}        data      
    * @param   {Object}     options   
    */
   _addTask(task, data, options = {}){
      if(typeof task !== 'function'){
         throw new TypeError('First argument should be a Function')
      }

      let { prepend } = options;
      
      if(prepend){
         this.queue.unshift({ task, data });
      }else{
         this.queue.push({ task, data });
      }

      this.emit(Events.TASK_ADDED);
      this.emit(Events.QUEUE_CHANGED, { action: Events.TASK_ADDED });
      this._queueChanged();
   }

   _nextTask(){
      if(this.queue.length > 0){
         this.processing++;

         let current = this.queue.shift();
         current.task.call(null, current.data, (...args) => this._taskDone.apply(this, args));
      }
   }

   _taskDone(result){
      this.processing--;

      this.emit(Events.TASK_DONE, result);
      this.emit(Events.QUEUE_CHANGED, { action: Events.TASK_DONE });
      this._queueChanged();
   }

   _queueChanged(){
      if (this.queue.length == 0 && this.processing == 0){
         this.emit(Events.QUEUE_EMPTY);
      }

      if (this.processing < this._parallel && this.queue.length > 0){
         this._nextTask();
      };
   }
}

module.exports = Queuem;
