import { useEffect, useRef, useState } from 'react';
import './App.css';
import { User, getUsers } from './api';
import UserTable from './UserTable';

function App() {
  return (
    <div className='App'>
      <div className='navbar'>
        <div className='heading'>
          <span>HaHa Heroes</span> VMS
        </div>
        <div>
          <button>Add a user</button>
        </div>
      </div>
      <UserTable/>
    </div>
  );
}

export default App;
