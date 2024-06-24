import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import SignIn from './components/signIn';
import FormReporte from './components/FormReporte';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/SignIn' element={<SignIn />}></Route>
        <Route path='/reporte' element={<FormReporte />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
