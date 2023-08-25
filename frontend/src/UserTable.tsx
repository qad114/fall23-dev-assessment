import './UserTable.css';
import { User, addUser, deleteUser, getUsers, updateUser } from './api';
import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10;

function genPageOffsets(total: number, pageSize: number) {
  const res = [];
  let n = 0;
  while (n < total) {
    res.push(n);
    n += pageSize;
  }
  return res;
}

export default function UserTable({ addTrigger, userSetter, clickTable, clickTableSetter }: {addTrigger: number, userSetter: (user: User) => void, clickTable: any, clickTableSetter: (table: any) => void}) {
  const [users, setUsers] = useState<User[]>([]);
  const [modifyIndex, setModifyIndex] = useState(-1);
  const [pageNumber, setPageNumber] = useState(0);

  const nameField = useRef<HTMLInputElement>(null);
  const avatarUriField = useRef<HTMLInputElement>(null);
  const heroProjectField = useRef<HTMLInputElement>(null);
  const notesField = useRef<HTMLInputElement>(null);
  const emailAddressField = useRef<HTMLInputElement>(null);
  const phoneNumberField = useRef<HTMLInputElement>(null);
  const ratingField = useRef<HTMLInputElement>(null);

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

  function onSaveBtnClick(userIndex: number) {
    setModifyIndex(-1);
    if (nameField.current && avatarUriField.current && heroProjectField.current && notesField.current && emailAddressField.current && phoneNumberField.current && ratingField.current) {
      const newUser: User = {
        name: nameField.current.value,
        avatar: avatarUriField.current.value,
        hero_project: heroProjectField.current.value,
        notes: notesField.current.value,
        email: emailAddressField.current.value,
        phone: phoneNumberField.current.value,
        rating: ratingField.current.value,
        status: users[userIndex].status,
        id: users[userIndex].id
      };
      setUsers(users.map((user, index) => index === userIndex ? newUser : user));
      updateUser(newUser);
    }
  }

  function onCancelBtnClick(userIndex: number) {
    setModifyIndex(-1);
  }

  function onDeleteBtnClick(userIndex: number) {
    const id = users.filter((user, index) => index === userIndex)[0].id;
    setUsers(users.filter((user, index) => index !== userIndex));
    deleteUser(id);
  }

  function onPageBtnClick(pageIndex: number) {
    setPageNumber(pageIndex);
  }

  function onRowClick(userIndex: number) {
    if (modifyIndex === -1) {
      const oldCount = clickTable[users[userIndex].id] || 0;
      clickTableSetter({...clickTable, [users[userIndex].id]: oldCount + 1});
      userSetter(users[userIndex]);
    }
  }

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    if (addTrigger > 0) {
      onAddBtnClick();
    }
  }, [addTrigger]);

  return (
    <div className='UserTable'>
      <div className='container-horizontal-scroll'>
        <table>
          <tr>
            <th>Name</th>
            <th>Avatar</th>
            <th>Hero Project</th>
            <th>Notes</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Rating</th>
            <th>Status</th>
            <th>User ID</th>
            <th>Operations</th>
          </tr>
          {users.map((user, index) => (
            <tr onClick={() => onRowClick(index)}>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={nameField} defaultValue={user.name} /></div> : user.name}</td>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={avatarUriField} defaultValue={user.avatar} /></div> : <img src={user.avatar} alt={`Avatar: ${user.name}`}></img>}</td>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={heroProjectField} defaultValue={user.hero_project} /></div> : user.hero_project}</td>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={notesField} defaultValue={user.notes} /></div> : user.notes}</td>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={emailAddressField} defaultValue={user.email} /></div> : user.email}</td>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={phoneNumberField} defaultValue={user.phone} /></div> : user.phone}</td>
              <td>{index === modifyIndex ? <div className='container-input'><input ref={ratingField} defaultValue={user.rating} /></div> : user.rating}</td>
              <td>{user.status ? 'Active' : 'Inactive'}</td>
              <td>{user.id}</td>
              <td>
                {
                  modifyIndex === -1 ? (
                    <div className='container-btns'>
                      <button onClick={e => {
                        e.stopPropagation();
                        onModifyBtnClick(index);
                      }}>Modify</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        onDeleteBtnClick(index);
                      }}>Delete</button>
                    </div>
                  ) : modifyIndex === index ? (
                    <div className='container-btns'>
                      <button onClick={e => {
                        e.stopPropagation();
                        onSaveBtnClick(index);
                      }}>Save</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        onCancelBtnClick(index);
                      }}>Cancel</button>
                    </div>
                  ) : null
                }
              </td>
            </tr>
          )).slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE)}
        </table>
      </div>
      <div className='pageselector'>
        {
          genPageOffsets(users.length, PAGE_SIZE)
          .map((offset, index) => 
            <button
              className={'btn-page ' + (index === pageNumber ? 'active' : 'inactive')}
              onClick={() => onPageBtnClick(index)}
            >
              {index + 1}
            </button>
          )
        }
      </div>
    </div>
  );
}