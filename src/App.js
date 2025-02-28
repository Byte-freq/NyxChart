import React from 'react';
import NyxChart from './NyxChart';
import sampleData from './data';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#131722' }}>
      <NyxChart data={sampleData} width={800} height={500} />
    </div>
  );
}

export default App;
