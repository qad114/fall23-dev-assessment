import './UserTable.css';
import { User } from './api';
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

type UserTableProps = {
  users: User[],
  modifyIndex: number,
  onRowClick: (userIndex: number) => void,
  onAddBtnClick: () => void,
  onModifyBtnClick: (userIndex: number) => void,
  onSaveBtnClick: (userIndex: number, newUser: User) => void,
  onCancelBtnClick: () => void,
  onDeleteBtnClick: (userIndex: number) => void,
};

export default function UserTable(props: UserTableProps) {
  const [pageNumber, setPageNumber] = useState(0);

  const nameField = useRef<HTMLInputElement>(null);
  const avatarUriField = useRef<HTMLInputElement>(null);
  const heroProjectField = useRef<HTMLInputElement>(null);
  const notesField = useRef<HTMLInputElement>(null);
  const emailAddressField = useRef<HTMLInputElement>(null);
  const phoneNumberField = useRef<HTMLInputElement>(null);
  const ratingField = useRef<HTMLInputElement>(null);

  function onPageBtnClick(pageIndex: number) {
    setPageNumber(pageIndex);
  }

  function genUserFromFields(status: boolean, id: string): User | null {
    if (nameField.current && avatarUriField.current && heroProjectField.current && notesField.current && emailAddressField.current && emailAddressField.current && phoneNumberField.current && ratingField.current) {
      return {
        name: nameField.current.value,
        avatar: avatarUriField.current.value,
        hero_project: heroProjectField.current.value,
        notes: notesField.current.value,
        email: emailAddressField.current.value,
        phone: phoneNumberField.current.value,
        rating: ratingField.current.value,
        status: status,
        id: id
      }
    }
    return null;
  }

  /*useEffect(() => {
    if (addTrigger > 0) {
      onAddBtnClick();
    }
  }, [addTrigger]);*/

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
          {props.users.map((user, index) => (
            <tr onClick={() => props.onRowClick(index)}>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={nameField} defaultValue={user.name} /></div> : user.name}</td>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={avatarUriField} defaultValue={user.avatar} /></div> : <img src={user.avatar} alt={`Avatar: ${user.name}`}></img>}</td>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={heroProjectField} defaultValue={user.hero_project} /></div> : user.hero_project}</td>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={notesField} defaultValue={user.notes} /></div> : user.notes}</td>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={emailAddressField} defaultValue={user.email} /></div> : user.email}</td>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={phoneNumberField} defaultValue={user.phone} /></div> : user.phone}</td>
              <td>{index === props.modifyIndex ? <div className='container-input'><input ref={ratingField} defaultValue={user.rating} /></div> : user.rating}</td>
              <td>{user.status ? 'Active' : 'Inactive'}</td>
              <td>{user.id}</td>
              <td>
                {
                  props.modifyIndex === -1 ? (
                    <div className='container-btns'>
                      <button onClick={e => {
                        e.stopPropagation();
                        props.onModifyBtnClick(index);
                      }}>Modify</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        props.onDeleteBtnClick(index);
                      }}>Delete</button>
                    </div>
                  ) : props.modifyIndex === index ? (
                    <div className='container-btns'>
                      <button onClick={e => {
                        e.stopPropagation();
                        const user = genUserFromFields(props.users[index].status, props.users[index].id);
                        if (user) props.onSaveBtnClick(index, user);
                      }}>Save</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        props.onCancelBtnClick();
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
          genPageOffsets(props.users.length, PAGE_SIZE)
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