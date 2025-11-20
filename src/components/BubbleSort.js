import React,{useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACTIVE_BAR_COLOR, COMPLETED_BAR_COLOR } from '../constants';

const BubbleSort = () =>{
   const myState = useSelector(state => state.updateProps);
   const dispatch = useDispatch();

   let values = myState.values.map((item) => item[0]);
   let ids = myState.values.map((item) => item[1]);
   
   const solve = () => {
      
      for(let i = values.length,timer = 0; i > 0;timer += i-1, i--){
         setTimeout(() => {
            for(let j = 1; j < i; j++){
               setTimeout(() => {
                  document.getElementById(ids[j]).childNodes[1].style.backgroundColor = ACTIVE_BAR_COLOR;
                  document.getElementById(ids[j-1]).childNodes[1].style.backgroundColor = ACTIVE_BAR_COLOR;
                  
                  setTimeout(() => {
                     document.getElementById(ids[j]).childNodes[1].style.backgroundColor = myState.color;
                     document.getElementById(ids[j-1]).childNodes[1].style.backgroundColor = myState.color;
                  },myState.speed-10);
                     
                  if(values[j]<values[j-1]){
                     let temp = values[j];
                     values[j] = values[j-1];
                     values[j-1] = temp;

                     temp = ids[j];
                     ids[j] = ids[j-1];
                     ids[j-1] = temp;
                     
                     document.getElementById(ids[j]).style.transform = `translateX(${j*11}px)`;
                     
                     document.getElementById(ids[j-1]).style.transform = `translateX(${(j-1)*11}px)`;
                        
                  }
               },(j-1)*(myState.speed));
            }
         }
         ,(timer)*(myState.speed))
      }
      
      setTimeout(() => {
         dispatch({
            type:'PLAY_PAUSE',
            _play:false
         })

         dispatch({
            type:'UPDATE_COLOR',
            color: COMPLETED_BAR_COLOR
         })

      },(((myState.values.length-1)*(myState.values.length))/2)*myState.speed+50);
   }
   
   useEffect(() => {
      if(myState.algorithm==='bubble'){
         if(myState.play)
            solve();
      }
   },[myState.play]);

   return <></>;
}

export default BubbleSort;