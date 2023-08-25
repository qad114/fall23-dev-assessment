import './UserInfo.css';
import { User } from "./api";

export default function UserInfo({ user, userSetter, clickTable }: {user: User, userSetter: (user: User | null) => void, clickTable: any}) {
  return (
    <div className='UserInfo'>
      <div className='container-avatar-name-contact'>
        <img src={user.avatar} />
        <div className='container-name-contact'>
          <div className='name'>{user.name}</div>
          <div className='email'>Email: {user.email}</div>
          <div className='phone'>Phone: {user.phone}</div>
        </div>
      </div>
      <div className='notes'>
        Hero Project: {user.hero_project}<br/>
        Notes: {user.notes}<br/>
        Status: {user.status ? 'Active' : 'Inactive'}
      </div>
      <div className='container-info-cards'>
        <div className='card'>
          <div>User ID</div>
          <div>{user.id}</div>
        </div>
        <div className='card'>
          <div>Rating</div>
          <div>{user.rating}</div>
        </div>
        <div className='card'>
          <div>Click Count</div>
          <div>{clickTable[user.id] || 0}</div>
        </div>
      </div>
      <button className='btn-close' onClick={() => userSetter(null)}>Close</button>
    </div>
  );
}