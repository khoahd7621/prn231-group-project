import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import { useAppDispatch } from "./reduxs/hooks";
import { fetchUserProfile } from "./reduxs/slices/profileSlice";
import Router from "./routes/Router";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  dispatch(fetchUserProfile()).finally(() => setLoading(false));

  if (loading) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={Router} />;
};

export default App;