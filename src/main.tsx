import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

import App from './App.tsx'
import './styles/index.css'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(<App />)
