/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const isResetPasswordPage = window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      {isResetPasswordPage ? <ResetPasswordPage /> : <App />}
    </AuthProvider>
  </React.StrictMode>
);
