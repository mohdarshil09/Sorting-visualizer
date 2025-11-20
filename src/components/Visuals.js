import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BubbleSort from './BubbleSort';
import InsertionSort from './InsertionSort';
import QuickSort from './QuickSort';
import MergeSort from './MergeSort';
import SelectionSort from './SelectionSort';
import './Visuals.css';

function Visuals() {
  const myState = useSelector(state => state.updateProps);
  const dispatch = useDispatch();
  const color = myState.color;
  const range = myState.range;

  const algorithmLabels = {
    bubble: 'Bubble Sort',
    insertion: 'Insertion Sort',
    merge: 'Merge Sort',
    selection: 'Selection Sort',
    quick: 'Quick Sort'
  };

  const speedLabels = {
    500: 'Slow',
    200: 'Medium',
    100: 'Fast',
    20: 'Super Fast',
    5: 'Ultra Fast'
  };

  const changeValues = () => {
    let new_arr = [...myState.values];
    for (let i = 0; i < new_arr.length; i++) {
      const element = document.getElementById(i);
      if (element) {
        element.style.transform = `translateX(${i * 11}px)`;
      }
    }

    dispatch({
      type: 'CHANGE_VALUES'
    });
  };

  const handlePlayPause = play => {
    if (myState.play) {
      return;
    }
    dispatch({
      type: 'PLAY_PAUSE',
      _play: play
    });
  };

  let speed = myState.speed;
  if (myState.algorithm === 'selection') speed *= 3;
  else if (myState.algorithm === 'merge') speed *= 5;
  else if (myState.algorithm === 'quick') speed *= 6;

  const summary = [
    {
      label: 'Array size',
      value: myState.values.length || range
    },
    {
      label: 'Speed',
      value: speedLabels[Number(myState.speed)] || `${myState.speed}ms`
    },
    {
      label: 'Color',
      value: color
    }
  ];

  const statusLabel = myState.play ? 'Live run' : 'Ready';

  return (
    <div className="visuals">
      <div className="visuals__summary">
        <div>
          <p className="summary__eyebrow">Now previewing</p>
          <h2>{algorithmLabels[myState.algorithm]}</h2>
        </div>

        <div className="visuals__stats">
          {summary.map(item => (
            <div key={item.label}>
              <p className="stat__label">{item.label}</p>
              <p className="stat__value">{item.value}</p>
            </div>
          ))}
        </div>

        <div className={`visuals__status ${myState.play ? 'is-live' : 'is-ready'}`}>{statusLabel}</div>
      </div>

      <div className="visualizer">
        {myState.algorithm === 'quick' && (
          <div className="legend">
            <div className="legend__lable"></div> Pivot elements
          </div>
        )}

        <div className="visual__items" style={{ width: `${myState.values.length * 11}px` }}>
          {myState.values.map(item => {
            return (
              <div
                className="visual__item"
                key={item[1]}
                id={item[1]}
                style={{ transition: `${speed / 1000}s linear all`, transform: `translateX(${item[1] * 11}px)` }}
              >
                <h4>{item[0]}</h4>
                <div
                  className="visual"
                  style={{ height: `${item[0] * 3}px`, backgroundColor: color, width: range < 35 ? '8px' : '6px' }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="visual__btns">
        <button id="change-btn" onClick={changeValues} disabled={myState.play}>
          Change values
        </button>
        <button id="play-btn" onClick={() => handlePlayPause(true)} disabled={myState.play || myState.values.length === 0}>
          {myState.play ? 'Playing...' : 'Play'}
        </button>
      </div>

      <BubbleSort />
      <InsertionSort />
      <MergeSort />
      <QuickSort />
      <SelectionSort />
    </div>
  );
}

export default Visuals;
