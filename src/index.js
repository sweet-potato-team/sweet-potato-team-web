import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/all.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom'; // 保持這裡的 BrowserRouter

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ-iMvIQxddIR4gAjyywLaikStS5rW8zg",
  authDomain: "store-picture-0625.firebaseapp.com",
  databaseURL: "https://store-picture-0625-default-rtdb.firebaseio.com",
  projectId: "store-picture-0625",
  storageBucket: "store-picture-0625.appspot.com",
  messagingSenderId: "634653010660",
  appId: "1:634653010660:web:0fbfb25ef459543c855af1",
  measurementId: "G-MRMGRXV8KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
