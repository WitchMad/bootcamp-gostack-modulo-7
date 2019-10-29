import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// Deixa o redux disponível para todos os componentes
import { Provider } from 'react-redux';
import './config/ReactotronConfig';
import GlobalStyle from './styles/global';
import Header from './components/Header';
import Routes from './routes';

// Import da função do redux
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes />
        <GlobalStyle />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
