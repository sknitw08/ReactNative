import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Loading } from './components/LoadingComponent';

import Main from './components/MainComponent'

const { persistor, store } = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate 
          loading={<Loading />}
          persistor={persistor}>
          <Main />
        </PersistGate>
    </Provider>
  );
}
