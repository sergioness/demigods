import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { List } from './components/list/List';
import { Profile } from './components/profile/Profile';

import "primereact/resources/themes/md-dark-deeppurple/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css"
import './App.css';
 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<List />} />
        <Route path='/demigods/:id' element={<Profile />} />
      </Routes>
      <Outlet />
    </BrowserRouter>
  );
}

export default App;
