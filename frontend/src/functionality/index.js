import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Register from './Register';
import BookDetails from './bookinfo';
import Search from './search';
import ReccomendationPage from './ReccomendationPage'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import HomePage from './homePage'
import Library from './Library'

import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Router>
      <AuthProvider>
      <Routes>
      <Route path ="/" element={<HomePage/>}/> 
      <Route path ="/Main" element={<App/>}/> 
      <Route path ="/Search" element={<Search/>}/>
      <Route path ="/Recommendations" element ={<ReccomendationPage/>}/>
      <Route path ="/Library" element ={<Library />}/>
      <Route path ="/Register" element ={<Register />}/>
      <Route path="/book/:id/:isbn10/:isbn13" element={<BookDetails/>} />


      </Routes> 
      </AuthProvider>
      </Router>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
