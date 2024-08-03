import { useAppStore } from '@/store';

const Profile = () => {
  const { userInfo } = useAppStore();

  return (
    <div>
      Profile
      <div className="email">{userInfo?.id}</div>
      <div className="email">{userInfo?.email}</div>
      <div className="email">{userInfo?.firstName}</div>
      <div className="email">{userInfo?.lastName}</div>
    </div>
  );
};

export default Profile;
