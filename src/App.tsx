import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyle from './style/GlobalStyle';
import Routes from './routes';

const App: React.FC = () => (
  <>
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
  <GlobalStyle/>
  </>
)


export default App;
