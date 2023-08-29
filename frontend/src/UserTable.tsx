import Checkbox from './Checkbox';
import './UserTable.css';
import { User } from './api';
import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10;

type UserTableProps = {
  users: User[],
  modifyId: string | null,
  filterProjectsQuery: string,
  onRowClick: (user: User) => void,
  onAddBtnClick: () => void,
  onModifyBtnClick: (user: User) => void,
  onSaveBtnClick: (user: User) => void,
  onCancelBtnClick: () => void,
  onDeleteBtnClick: (user: User) => void,
};

export default function UserTable(props: UserTableProps) {
  const [pageNumber, setPageNumber] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const nameField = useRef<HTMLInputElement>(null);
  const avatarUriField = useRef<HTMLInputElement>(null);
  const heroProjectField = useRef<HTMLInputElement>(null);
  const notesField = useRef<HTMLInputElement>(null);
  const emailAddressField = useRef<HTMLInputElement>(null);
  const phoneNumberField = useRef<HTMLInputElement>(null);
  const ratingField = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const numPages = Math.ceil(sortAndFilter(props.users).length / PAGE_SIZE);
    if (numPages > 0 && pageNumber >= numPages) {
      setPageNumber(numPages - 1);
    }
  }, [props.users, props.filterProjectsQuery]);

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
    if (sortColumn !== null) {
      users = [...users].sort((user1, user2) => {
        if (sortColumn === 'status') {
          return ((+ user1.status) - (+ user2.status)) * (sortAscending ? 1 : -1);
        } else if (sortColumn === 'id') {
          return (parseInt(user1.id) - parseInt(user2.id)) * (sortAscending ? 1 : -1);
        } else {
          return sortAscending ? user1[sortColumn].localeCompare(user2[sortColumn]) : user2[sortColumn].localeCompare(user1[sortColumn]);
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
            <th className={sortColumn === 'name' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('name')}>Name</th>
            <th>Avatar</th>
            <th className={sortColumn === 'hero_project' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('hero_project')}>Hero Project</th>
            <th className={sortColumn === 'notes' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('notes')}>Notes</th>
            <th className={sortColumn === 'email' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('email')}>Email Address</th>
            <th className={sortColumn === 'phone' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('phone')}>Phone Number</th>
            <th className={sortColumn === 'rating' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('rating')}>Rating</th>
            <th className={sortColumn === 'status' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('status')}>Active?</th>
            <th className={sortColumn === 'id' ? (sortAscending ? 'sorted-asc' : 'sorted-desc') : ''} onClick={() => onTableHeaderClick('id')}>User ID</th>
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
          .slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE)}
        </table>
      </div>
      <div className='pageselector'>
        {
          Array(Math.ceil(sortAndFilter(props.users).length / PAGE_SIZE))
          .fill(0)
          .map((_, index) => 
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