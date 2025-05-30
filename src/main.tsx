import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/fonts.css'
import './assets/styles.sass'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'National Park', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
)
