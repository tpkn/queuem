/*!
 * Queuem (v1.1.0.20180318), http://tpkn.me/
 */

class Queuem {
   constructor(options){
      this.task;
      this.queue = [];
      this.processing = 0;

      this.concurrent = 1;
      this.onTaskDone = () => {};
      this.onComplete = () => {};

      if(typeof options === 'object'){
         if(typeof options.concurrent === 'number' && options.concurrent > 0){
            this.concurrent = options.concurrent;
         }
         if(typeof options.taskDone === 'function'){
            this.onTaskDone = options.taskDone;
         }
         if(typeof options.onComplete === 'function'){
            this.onComplete = options.onComplete;
         }
      }
   }

   /**
    * Add new task in a queue
    * @param {Function} task
    */
   add(task){
      this.queue.push(task);
      this.onChange();
   }

   /**
    * Start the next task in a queue
    */
   runTask(){
      if(this.queue.length > 0){
         this.processing++;

         this.task = this.queue.shift();

         this.task().then(result => {
            this.taskDone(result);
         }).catch(err => {
            this.taskDone(err);
         })
      }
   }

   /**
    * Some task has been completed right now
    * @param  {Object} results
    */
   taskDone(results){
      this.processing--;
      this.onTaskDone(results);
      this.onChange();
   }

   /**
    * Something just changed
    */
   onChange(){
      if(this.queue.length == 0 && this.processing == 0){
         this.onComplete();
      }

      if(this.processing < this.concurrent && this.queue.length > 0){
         this.runTask();
      };
   }

   /**
    * Set amount of concurrent tasks
    * @param  {Number} n
    */
   set con(n){
      if(typeof n === 'number' && n > 0){
         this.concurrent = n;

         let p = this.processing;
         while(p < this.concurrent){
            this.runTask();
            p++;
         }
      }
   }
}

module.exports = Queuem;
