import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

// Import both providers
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'

// Initialize the TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents annoying jumps when switching tabs
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <UIProvider>
          <App />
        </UIProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)