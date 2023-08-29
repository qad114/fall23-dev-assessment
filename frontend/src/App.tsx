import { useEffect, useRef, useState } from 'react';
import './App.css';
import { User, addUser, deleteUser, getUsers, updateUser } from './api';
import UserTable from './UserTable';
import UserInfo from './UserInfo';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [modifyId, setModifyId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [clickTable, setClickTable] = useState<any>({});
  const [filterProjectsQuery, setFilterProjectsQuery] = useState('');

  const filterProjectsField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUsers().then(users => setUsers(users));
  }, []);

  function onRowClick(user: User) {
    if (modifyId === null) {
      const oldCount = clickTable[user.id] || 0;
      setClickTable({...clickTable, [user.id]: oldCount + 1});
      setSelectedUser(user);
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
    setModifyId(newUser.id);
  }

  function onModifyBtnClick(user: User) {
    setModifyId(user.id);
  }

  function onSaveBtnClick(user: User) {
    setModifyId(null);
    setUsers(users.map(oldUser => user.id === oldUser.id ? user : oldUser));
    updateUser(user);
  }

  function onCancelBtnClick() {
    setModifyId(null);
  }

  function onDeleteBtnClick(user: User) {
    setUsers(users.filter(oldUser => user.id !== oldUser.id));
    deleteUser(user.id);
  }

  return (
    <div className='App'>
      <div className='navbar'>
        <div className='heading'>
          <span>HaHa Heroes</span> VMS
        </div>
        <div className='container-input-button'>
          <input ref={filterProjectsField} className='input-filter-projects' type='text' placeholder='Filter projects...' onChange={() => setFilterProjectsQuery(filterProjectsField.current?.value || '')} />
          <button onClick={onAddBtnClick}>Add a user</button>
        </div>
      </div>
      {
        selectedUser === null
        ? <UserTable
          users={users}
          modifyId={modifyId}
          filterProjectsQuery={filterProjectsQuery}
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
