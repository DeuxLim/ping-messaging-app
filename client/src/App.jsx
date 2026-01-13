import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css' // Global CSS

import { RouterProvider } from "react-router" // Enable Routing
import { routes } from "./routes/router" // Custom Routing
import AuthProvider from "./contexts/auth/AuthProvider"
import SocketProvider from "./contexts/socket/SocketProvider"

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<SocketProvider>
				<RouterProvider router={routes} />
			</SocketProvider>
		</AuthProvider>
	</StrictMode>,
)
