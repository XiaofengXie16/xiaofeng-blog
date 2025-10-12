// src/client.tsx
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'

hydrateRoot(document.body, <StartClient />)
