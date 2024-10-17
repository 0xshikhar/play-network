import UserProfilePage from '@/components/MaskProfile';

const Profile = ({ params }) => {
    return <UserProfilePage id={ params.id } />;
};

export default Profile;