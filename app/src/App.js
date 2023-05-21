
import './App.css';
import QRConfig from './QRConfigrator/index'
import Splash from "./Splash";
import Shim from './Shim';
import { hot } from "react-hot-loader/root";
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/qrconfig" element={<QRConfig />} />
            <Route path="/play" element={<Shim/>} />
            <Route path="/" extact element={<Splash/>} />
          </Routes> 
        </BrowserRouter>
      </header>
    </div>
  );
}

export default hot(App);
