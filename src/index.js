import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppContainer from './components/App/AppContainer';
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { unregister } from './registerServiceWorker';
import routineApp from './redux/reducer.js';

let devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
if(!devTools) devTools = a=>a;
const store = createStore(routineApp,
    compose(
            applyMiddleware(thunk),
            devTools
        )
    );


ReactDOM.render(<Provider store={store}><Router><AppContainer /></Router></Provider>, document.getElementById('root'));
unregister();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js',{scope:'/'})
    .then((registration)=>{
        console.log("SW is registered on scope: " + registration.scope);
    })
    .catch((err)=>{
        console.log('SW failed to register', err);
    })
}
