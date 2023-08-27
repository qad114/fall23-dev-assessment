import { useEffect, useState } from 'react';
import './App.css';
import { User, addUser, deleteUser, getUsers, updateUser } from './api';
import UserTable from './UserTable';
import UserInfo from './UserInfo';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [modifyIndex, setModifyIndex] = useState(-1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [clickTable, setClickTable] = useState<any>({});

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users);
    });
  }, []);

  function onRowClick(userIndex: number) {
    if (modifyIndex === -1) {
      const oldCount = clickTable[users[userIndex].id] || 0;
      setClickTable({...clickTable, [users[userIndex].id]: oldCount + 1});
      setSelectedUser(users[userIndex]);
    }
  }

  function onAddBtnClick() {
    const newUser: User = {
      name: 'New User',
      avatar: '',
      hero_project: '',
      notes: '',
      email: '',
      phone: '',
      rating: '',
      status: false,
      id: Math.floor(101 + (Math.random() * 10000)).toString()
    };
    setUsers([newUser, ...users]);
    addUser(newUser);
    setModifyIndex(0);
  }

  function onModifyBtnClick(userIndex: number) {
    setModifyIndex(userIndex);
  }

  function onSaveBtnClick(userIndex: number, newUser: User) {
    setModifyIndex(-1);
    setUsers(users.map((user, index) => index === userIndex ? newUser : user));
    updateUser(newUser);
  }

  function onCancelBtnClick() {
    setModifyIndex(-1);
  }

  function onDeleteBtnClick(userIndex: number) {
    const id = users.filter((user, index) => index === userIndex)[0].id;
    setUsers(users.filter((user, index) => index !== userIndex));
    deleteUser(id);
  }

  return (
    <div className='App'>
      <div className='navbar'>
        <div className='heading'>
          <span>HaHa Heroes</span> VMS
        </div>
        <div>
          <button onClick={onAddBtnClick}>Add a user</button>
        </div>
      </div>
      {
        selectedUser === null
        ? <UserTable
          users={users}
          modifyIndex={modifyIndex}
          onRowClick={onRowClick}
          onAddBtnClick={onAddBtnClick}
          onModifyBtnClick={onModifyBtnClick}
          onSaveBtnClick={onSaveBtnClick}
          onCancelBtnClick={onCancelBtnClick}
          onDeleteBtnClick={onDeleteBtnClick} />
        : <UserInfo 
          user={selectedUser}
          numClicks={clickTable[selectedUser.id] || 0}
          onCloseBtnClick={() => setSelectedUser(null)} />
      }
    </div>
  );
}

export default App;
