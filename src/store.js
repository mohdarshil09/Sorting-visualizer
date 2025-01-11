// store.js
import { createStore } from 'redux';
import rootReducer from './reducer'; // Adjust the path if necessary

const store = createStore(rootReducer);

export default store;
