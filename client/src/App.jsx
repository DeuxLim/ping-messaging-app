import { RouterProvider } from "react-router" // Enable Routing
import { routes } from "./routes/router" // Custom Routing
import AuthProvider from "./contexts/AuthProvider"

function App() {
  return (
    <AuthProvider>
        <RouterProvider router={routes} />
    </AuthProvider>
  )
}

export default App
