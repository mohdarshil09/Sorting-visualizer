import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACTIVE_BAR_COLOR, COMPLETED_BAR_COLOR } from '../constants';

const MergeSort = () => {
   const myState = useSelector(state => state.updateProps);
   const dispatch = useDispatch();

   let values = myState.values.map((item) => item[0]);
   let ids = myState.values.map((item) => item[1]);

   const mergeSort = (values,ids,timer,l,r) => {
      if(l >= r)
         return;

      let mid = Math.floor((l+r)/2);

      mergeSort(values,ids,timer-1,l,mid);
      mergeSort(values,ids,timer-1,mid+1,r);

      setTimeout(() => {
         for(let i = l; i <= r; i++)
            document.getElementById(ids[i]).childNodes[1].style.backgroundColor = ACTIVE_BAR_COLOR;

         for(let i = l; i <= r; i++){
         for(let j = i+1; j <= r; j++){

            if(values[i]>values[j]){
               [values[i],values[j]] = [values[j],values[i]];
               [ids[i],ids[j]] = [ids[j],ids[i]];
               
               let new_ids = [...ids];

               document.getElementById(new_ids[i]).style.transform = `translateX(${i*11}px)`;
               document.getElementById(new_ids[j]).style.transform = `translateX(${j*11}px)`;
               }
            }
         }
      },timer*myState.speed*5);
   }

   const solve = () => {
      mergeSort(values,ids,Math.ceil(Math.log(values.length+1)),0,values.length-1);

      setTimeout(() => {
         dispatch({
            type:'PLAY_PAUSE',
            _play:false
         })

         dispatch({
            type:'UPDATE_COLOR',
            color: COMPLETED_BAR_COLOR
         })
      },5*myState.speed*(1+Math.ceil(Math.log(values.length+1)))+50);
   };

   useEffect(() => {
      if(myState.algorithm==='merge'){
         if(myState.play)
            solve();
      }
   },[myState.play]);

   return <></>;
}

export default MergeSort;