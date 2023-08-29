import { useEffect, useRef, useState } from 'react';
import './App.css';
import { User, addUser, deleteUser, getUsers, updateUser } from './api';
import UserTable from './UserTable';
import UserInfo from './UserInfo';

const PAGE_SIZE = 10;

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [modifyId, setModifyId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [clickTable, setClickTable] = useState<any>({});
  const [filterProjectsQuery, setFilterProjectsQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const filterProjectsField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUsers().then(users => setUsers(users));
  }, []);

  useEffect(() => {
    const numPages = Math.ceil(users.filter(user => user.hero_project.toLowerCase().includes(filterProjectsQuery.toLowerCase())).length / PAGE_SIZE);
    if (numPages > 0 && pageNumber >= numPages) {
      setPageNumber(numPages - 1);
    }
  }, [users, filterProjectsQuery]);

  function onRowClick(user: User) {
    if (modifyId === null) {
      const oldCount = clickTable[user.id] || 0;
      setClickTable({...clickTable, [user.id]: oldCount + 1});
      setSelectedUser(user);
    }
  }

  function onAddBtnClick() {
    setPageNumber(0);
    setSortColumn(null);
    setSortAscending(false);

    const newUser: User = {
      name: '',
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

  function onPageBtnClick(pageIndex: number) {
    setPageNumber(pageIndex);
  }

  function onTableHeaderClick(column: keyof User) {
    if (column === sortColumn) {
      if (sortAscending) {
        setSortAscending(false);
      } else {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortAscending(true);
    }
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
          pageSize={PAGE_SIZE}
          pageNumber={pageNumber}
          sortColumn={sortColumn}
          sortAscending={sortAscending}
          onRowClick={onRowClick}
          onModifyBtnClick={onModifyBtnClick}
          onSaveBtnClick={onSaveBtnClick}
          onCancelBtnClick={onCancelBtnClick}
          onDeleteBtnClick={onDeleteBtnClick}
          onTableHeaderClick={onTableHeaderClick}
          onPageBtnClick={onPageBtnClick} />
        : <UserInfo 
          user={selectedUser}
          numClicks={clickTable[selectedUser.id] || 0}
          onCloseBtnClick={() => setSelectedUser(null)} />
      }
    </div>
  );
}

export default App;
