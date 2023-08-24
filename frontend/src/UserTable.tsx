import './UserTable.css';
import { User, getUsers } from './api';
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

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [modifyIndex, setModifyIndex] = useState(-1);
  //const [offset, setOffset] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const nameField = useRef<HTMLInputElement>(null);
  const avatarUriField = useRef<HTMLInputElement>(null);
  const heroProjectField = useRef<HTMLInputElement>(null);
  const notesField = useRef<HTMLInputElement>(null);
  const emailAddressField = useRef<HTMLInputElement>(null);
  const phoneNumberField = useRef<HTMLInputElement>(null);
  const ratingField = useRef<HTMLInputElement>(null);

  function onModifyBtnClick(userIndex: number) {
    setModifyIndex(userIndex);
  }

  function onSaveBtnClick(userIndex: number) {
    setModifyIndex(-1);
    setUsers(users.map((user, index) => {
      if (index === userIndex && nameField.current && avatarUriField.current && heroProjectField.current && notesField.current && emailAddressField.current && phoneNumberField.current && ratingField.current) {
        user.name = nameField.current.value;
        user.avatar = avatarUriField.current.value;
        user.hero_project = heroProjectField.current.value;
        user.notes = notesField.current.value;
        user.email = emailAddressField.current.value;
        user.phone = phoneNumberField.current.value;
        user.rating = ratingField.current.value;
      }
      return user;
    }));
  }

  function onCancelBtnClick(userIndex: number) {
    setModifyIndex(-1);
  }

  function onDeleteBtnClick(userIndex: number) {
    setUsers(users.filter((user, index) => index !== userIndex));
  }

  function onPageBtnClick(pageIndex: number) {
    //setOffset(PAGE_SIZE * pageIndex);
    setPageNumber(pageIndex);
  }

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users);
    });
  }, []);

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
          {users.slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE).map((user, index) => (
            <tr>
              <td>{index === modifyIndex ? <input ref={nameField} defaultValue={user.name} /> : user.name}</td>
              <td>{index === modifyIndex ? <input ref={avatarUriField} defaultValue={user.avatar} /> : <img src={user.avatar} alt={`Avatar: ${user.name}`}></img>}</td>
              <td>{index === modifyIndex ? <input ref={heroProjectField} defaultValue={user.hero_project} /> : user.hero_project}</td>
              <td>{index === modifyIndex ? <input ref={notesField} defaultValue={user.notes} /> : user.notes}</td>
              <td>{index === modifyIndex ? <input ref={emailAddressField} defaultValue={user.email} /> : user.email}</td>
              <td>{index === modifyIndex ? <input ref={phoneNumberField} defaultValue={user.phone} /> : user.phone}</td>
              <td>{index === modifyIndex ? <input ref={ratingField} defaultValue={user.rating} /> : user.rating}</td>
              <td>{user.status ? 'Active' : 'Inactive'}</td>
              <td>{user.id}</td>
              <td>
                {
                  modifyIndex === -1 ? (
                    <div className='container-btns'>
                      <button onClick={() => onModifyBtnClick(index)}>Modify</button>
                      <button onClick={() => onDeleteBtnClick(index)}>Delete</button>
                    </div>
                  ) : modifyIndex === index ? (
                    <div className='container-btns'>
                      <button onClick={() => onSaveBtnClick(index)}>Save</button>
                      <button onClick={() => onCancelBtnClick(index)}>Cancel</button>
                    </div>
                  ) : null
                }
              </td>
            </tr>
          ))}
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