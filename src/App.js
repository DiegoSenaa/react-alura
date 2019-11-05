import React from 'react';

import Cabecalho from './components/Cabecalho';
import NavMenu from './components/NavMenu';

function App() {
  return (
    <>
      <Cabecalho>
        <NavMenu usuario="@omariosouto"/>
      </Cabecalho>
    </>
  );
}

export default App;
