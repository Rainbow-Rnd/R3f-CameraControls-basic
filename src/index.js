import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')).render(<App id={'test_id'} url={'rtsp://localhost:8554/drone'}  />)

//
// import React from 'react';
// import { render } from 'react-dom';
// import StreamedianPlayer from './StreamedianPlayer';
// import './index.css';
//
// const App = ({url, id}) => (
//   <div>
//     <StreamedianPlayer id={id}>
//       {  <source  src={url} type="application/x-rtsp" />  }
//     </StreamedianPlayer>
//   </div>
// );
//
// render(<App />, document.getElementById('root'));
