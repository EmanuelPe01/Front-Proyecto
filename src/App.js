import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import SignIn from './components/signIn';
import FormReporte from './components/FormReporte';
import Reportes from './components/Reportes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/SignIn' element={<SignIn />}></Route>
        <Route path='/reportes' element={<Reportes/>}/>
        <Route path='/reportes/nuevo' element={<FormReporte />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
