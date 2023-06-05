import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
// add these two library import statements
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  // uri: 'http://localhost:3001/graphql'
  cache: new InMemoryCache(),
  request: operation => {
    const token = localStorage.getItem('id_token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
  uri: '/graphql'
});



function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
          <>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<SearchBooks />} />
            <Route exact path='/saved' element={<SavedBooks />} />
            <Route path='*'  element={<h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
          </>
        </Router> 
    </ApolloProvider>

  );
}

export default App;