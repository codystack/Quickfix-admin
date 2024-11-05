import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import store from './redux/store';
import APIService from './service/api.service';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <Provider store={store}>
            <SWRConfig
              value={{
                // refreshInterval: 3000,
                fetcher: (url) => APIService.fetcher(url),
              }}
            >
              <App />
            </SWRConfig>
          </Provider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
