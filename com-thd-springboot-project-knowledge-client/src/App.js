import logo from './logo.svg';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import IndexLayout from '@/layout/IndexLayout'
function App() {
  return (
    <BrowserRouter>
    <IndexLayout></IndexLayout>
    </BrowserRouter>
  );
}

export default App;
