
import './App.css';
import { RouterProvider, useLocation, useNavigationType } from 'react-router-dom';
import root from './router/root';
import { useEffect } from 'react';
import ScrollTopBtn from './components/common/ScrollTopBtn';


function App() {
  return (
    <>
      <ScrollTopBtn/>
      <RouterProvider router={root} />
    </>

  )
}

export default App;
