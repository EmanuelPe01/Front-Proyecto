import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import SignIn from './components/signIn';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/SignIn' element={<SignIn />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
