import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import { favoriteListReducer } from '../reducers/favoriteReducer';

const rooteReducer = combineReducers({
    favorite: favoriteListReducer
    // dateCount : ...
})

const store = createStore(rooteReducer, applyMiddleware(logger));

export default store;