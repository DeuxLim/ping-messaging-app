import { RouterProvider } from "react-router" // Enable Routing
import { routes } from "./routes/router" // Custom Routing

function App() {
  return (
    <RouterProvider router={routes} />
  )
}

export default App
