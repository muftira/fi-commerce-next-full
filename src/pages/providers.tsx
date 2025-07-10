'use client';

import { store, persistor } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
