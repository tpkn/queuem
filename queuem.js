/*!
 * Queuem (v1.0.0.20180317), http://tpkn.me/
 */

function Queuem(max_concurrent, on_complete){
   let task;
   let queue = [];
   let current = 0;

   if(typeof max_concurrent === 'function'){
      on_complete = max_concurrent;
   }

   if(typeof max_concurrent !== 'number'){
      max_concurrent = 3;
   }

   if(max_concurrent < 1){
      max_concurrent = 1;
   }

   function add(task){
      queue.push(task);
      on_change();
   }

   function on_change(){
      if(queue.length == 0 && current == 0){
         if(typeof on_complete === 'function'){
            on_complete();
         }
      }

      if(current < max_concurrent && queue.length > 0){
         current++;

         task = queue.shift();

         task().then(r => {
            current--;
            on_change();
         }, err => {
            current--;
            on_change();
         })
      }
   }

   return { add, queue };
}

module.exports = Queuem;
