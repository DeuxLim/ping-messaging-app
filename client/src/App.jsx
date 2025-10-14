import { RouterProvider } from "react-router" // Enable Routing
import { routes } from "./routes/router" // Custom Routing
import AuthProvider from "./contexts/auth/AuthProvider"
import SocketProvider from "./contexts/socket/SocketProvider"

function App() {
	return (
		<AuthProvider>
			<SocketProvider>
				<RouterProvider router={routes} />
			</SocketProvider>
		</AuthProvider>
	)
}

export default App
