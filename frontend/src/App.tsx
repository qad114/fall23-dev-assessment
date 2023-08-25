import { useState } from 'react';
import './App.css';
import { User } from './api';
import UserTable from './UserTable';
import UserInfo from './UserInfo';

function App() {
  // Triggers add course action in table
  const [addTrigger, setAddTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [clickTable, setClickTable] = useState<any>({});

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
      {
        selectedUser === null
        ? <UserTable addTrigger={addTrigger} userSetter={setSelectedUser} clickTable={clickTable} clickTableSetter={setClickTable} />
        : <UserInfo user={selectedUser} userSetter={setSelectedUser} clickTable={clickTable} />
      }
    </div>
  );
}

export default App;
