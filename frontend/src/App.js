import './App.css';
import React, {useEffect} from 'react';
import { AllRoutes } from './routes/AllRoutes';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {

  useEffect(() => {
    localStorage.setItem("role", "user")
  }, [])
  return (
    <div className="App w-full">
      <AllRoutes />
    </div>
  );
}

export default App;
