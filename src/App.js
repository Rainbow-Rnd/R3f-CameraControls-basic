import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ModelApp from './ModelApp';
import StreamedianPlayer from './StreamedianPlayer';

function App({url, id}) {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">video</Link></li>
          <li><Link to="/model">model</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={
          <StreamedianPlayer id={id} >
          { <source  src={url} type="application/x-rtsp" /> }
        </StreamedianPlayer>} />
        <Route path="/model" element={<ModelApp />} />
      </Routes>
    </Router>
  );
}
export default App;
