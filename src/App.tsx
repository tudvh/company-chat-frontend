import { GoogleOAuthProvider } from '@react-oauth/google'
import { Suspense } from 'react'

import { LoadingOverlay } from './components/ui'
import { AuthProvider, LoadingProvider } from './contexts'
import { getEnv } from './helpers'
import Routes from './routes'

function App() {
  return (
    <GoogleOAuthProvider clientId={getEnv('VITE_GOOGLE_CLIENT_ID')}>
      <LoadingProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingOverlay open />}>
            <Routes />
          </Suspense>
        </AuthProvider>
      </LoadingProvider>
    </GoogleOAuthProvider>
  )
}

export default App
