import Checkbox from './Checkbox';
import './UserTable.css';
import { User } from './api';
import { useEffect, useRef, useState } from 'react';

type UserTableProps = {
  users: User[],
  modifyId: string | null,
  filterProjectsQuery: string,
  pageSize: number,
  pageNumber: number,
  sortColumn: keyof User | null,
  sortAscending: boolean,
  onRowClick: (user: User) => void,
  onModifyBtnClick: (user: User) => void,
  onSaveBtnClick: (user: User) => void,
  onCancelBtnClick: () => void,
  onDeleteBtnClick: (user: User) => void,
  onTableHeaderClick: (column: keyof User) => void,
  onPageBtnClick: (pageIndex: number) => void
};

export default function UserTable(props: UserTableProps) {
  const nameField = useRef<HTMLInputElement>(null);
  const avatarUriField = useRef<HTMLInputElement>(null);
  const heroProjectField = useRef<HTMLInputElement>(null);
  const notesField = useRef<HTMLInputElement>(null);
  const emailAddressField = useRef<HTMLInputElement>(null);
  const phoneNumberField = useRef<HTMLInputElement>(null);
  const ratingField = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState(false);

  function genUserFromFields(id: string): User | null {
    if (nameField.current && avatarUriField.current && heroProjectField.current && notesField.current && emailAddressField.current && emailAddressField.current && phoneNumberField.current && ratingField.current /*&& isActiveCheckbox.current*/) {
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

  function sortAndFilter(users: User[]) {
    if (props.sortColumn !== null) {
      users = [...users].sort((user1, user2) => {
        if (props.sortColumn === 'status') {
          return ((+ user1.status) - (+ user2.status)) * (props.sortAscending ? 1 : -1);
        } else if (props.sortColumn === 'id') {
          return (parseInt(user1.id) - parseInt(user2.id)) * (props.sortAscending ? 1 : -1);
        } else if (props.sortColumn !== null) {
          return props.sortAscending ? user1[props.sortColumn].localeCompare(user2[props.sortColumn]) : user2[props.sortColumn].localeCompare(user1[props.sortColumn]);
        } else {
          return 0;
        }
      });
    }
    
    if (props.filterProjectsQuery !== '') {
      return users.filter(user => user.hero_project.toLowerCase().includes(props.filterProjectsQuery.toLowerCase()));
    }
    return users;
  }

  return (
    <div className='UserTable'>
      <div className='container-horizontal-scroll'>
        <table>
          <tr>
            <th className={props.sortColumn === 'name' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('name')}>Name</th>
            <th>Avatar</th>
            <th className={props.sortColumn === 'hero_project' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('hero_project')}>Hero Project</th>
            <th className={props.sortColumn === 'notes' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('notes')}>Notes</th>
            <th className={props.sortColumn === 'email' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('email')}>Email Address</th>
            <th className={props.sortColumn === 'phone' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('phone')}>Phone Number</th>
            <th className={props.sortColumn === 'rating' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('rating')}>Rating</th>
            <th className={props.sortColumn === 'status' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('status')}>Active?</th>
            <th className={props.sortColumn === 'id' ? (props.sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => props.onTableHeaderClick('id')}>User ID</th>
            <th>Operations</th>
          </tr>
          {sortAndFilter(props.users).map((user, index) => (
            <tr onClick={() => props.onRowClick(user)}>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={nameField} defaultValue={user.name} /></div> : user.name}</td>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={avatarUriField} defaultValue={user.avatar} /></div> : <img src={user.avatar} alt={`Avatar: ${user.name}`}></img>}</td>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={heroProjectField} defaultValue={user.hero_project} /></div> : user.hero_project}</td>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={notesField} defaultValue={user.notes} /></div> : user.notes}</td>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={emailAddressField} defaultValue={user.email} /></div> : user.email}</td>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={phoneNumberField} defaultValue={user.phone} /></div> : user.phone}</td>
              <td>{user.id === props.modifyId ? <div className='container-input'><input ref={ratingField} defaultValue={user.rating} /></div> : user.rating}</td>
              <td><Checkbox readOnly={user.id !== props.modifyId} value={user.id === props.modifyId ? status : user.status} onClick={() => setStatus(!status)} /></td>
              <td>{user.id}</td>
              <td>
                {
                  props.modifyId === null ? (
                    <div className='container-btns'>
                      <button onClick={e => {
                        e.stopPropagation();
                        setStatus(user.status);
                        props.onModifyBtnClick(user);
                      }}>Modify</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        props.onDeleteBtnClick(user);
                      }}>Delete</button>
                    </div>
                  ) : props.modifyId === user.id ? (
                    <div className='container-btns'>
                      <button onClick={e => {
                        e.stopPropagation();
                        setStatus(false);
                        const newUser = genUserFromFields(user.id);
                        if (newUser) props.onSaveBtnClick(newUser);
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
          ))
          .slice(props.pageNumber * props.pageSize, (props.pageNumber + 1) * props.pageSize)}
        </table>
      </div>
      <div className='pageselector'>
        {
          Array(Math.ceil(sortAndFilter(props.users).length / props.pageSize))
          .fill(0)
          .map((_, index) => 
            <button
              className={'btn-page ' + (index === props.pageNumber ? 'active' : 'inactive')}
              onClick={() => props.onPageBtnClick(index)}
            >
              {index + 1}
            </button>
          )
        }
      </div>
    </div>
  );
}