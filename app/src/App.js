
import './App.css';
import QRConfig from './QRConfigrator/index'
import Splash from "./Splash";
import Main from './player/main';
import { hot } from "react-hot-loader/root";
import { Route, BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/qrconfig" element={<QRConfig />} />
            <Route path="/play" element={<Main/>} />
            <Route path="/" extact element={<Splash/>} />
          </Routes> 
        </BrowserRouter>
      </header>
    </div>
  );
}

export default hot(App);
