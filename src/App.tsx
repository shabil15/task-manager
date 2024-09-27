import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/mainRoutes";

function App() {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <RouterProvider router={router} fallbackElement={<div>...loading</div>} />
    </Suspense>
  );
}

export default App;
