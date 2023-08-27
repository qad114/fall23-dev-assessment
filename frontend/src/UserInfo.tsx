import './UserInfo.css';
import { User } from "./api";

type UserInfoProps = {
  user: User,
  numClicks: number,
  onCloseBtnClick: () => void
}

export default function UserInfo(props: UserInfoProps) {
  return (
    <div className='UserInfo'>
      <div className='container-avatar-name-contact'>
        <img src={props.user.avatar} />
        <div className='container-name-contact'>
          <div className='name'>{props.user.name}</div>
          <div className='email'>Email: {props.user.email}</div>
          <div className='phone'>Phone: {props.user.phone}</div>
        </div>
      </div>
      <div className='notes'>
        Hero Project: {props.user.hero_project}<br/>
        Notes: {props.user.notes}<br/>
        Status: {props.user.status ? 'Active' : 'Inactive'}
      </div>
      <div className='container-info-cards'>
        <div className='card'>
          <div>User ID</div>
          <div>{props.user.id}</div>
        </div>
        <div className='card'>
          <div>Rating</div>
          <div>{props.user.rating}</div>
        </div>
        <div className='card'>
          <div>Click Count</div>
          <div>{props.numClicks}</div>
        </div>
      </div>
      <button className='btn-close' onClick={props.onCloseBtnClick}>Close</button>
    </div>
  );
}