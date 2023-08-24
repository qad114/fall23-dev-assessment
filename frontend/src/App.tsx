import { useEffect, useRef, useState } from 'react';
import './App.css';
import { User, getUsers } from './api';
import UserTable from './UserTable';

function App() {
  // Triggers add course action in table
  const [addTrigger, setAddTrigger] = useState(0);

  return (
    <div className='App'>
      <div className='navbar'>
        <div className='heading'>
          <span>HaHa Heroes</span> VMS
        </div>
        <div>
          <button onClick={() => setAddTrigger(addTrigger + 1)}>Add a user</button>
        </div>
      </div>
      <UserTable addTrigger={addTrigger} />
    </div>
  );
}

export default App;
