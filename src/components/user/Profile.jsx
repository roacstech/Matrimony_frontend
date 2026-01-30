import { useParams } from "react-router-dom";
import { getUserById } from "../../Data/Connections";

const Profile = () => {
  const { id } = useParams();
  const user = getUserById(Number(id));

  if (!user) return <h2>User not found</h2>;

  return (
    <div style={{ padding: 30 }}>
      <img
        src={user.photo}
        alt=""
        width={150}
        style={{ borderRadius: "50%" }}
      />

      <h1>{user.fullName}</h1>

      <p><b>Gender:</b> {user.gender}</p>
      <p><b>City:</b> {user.city}</p>
      <p><b>Education:</b> {user.education}</p>
      <p><b>Occupation:</b> {user.occupation}</p>
    </div>
  );
};

export default Profile;
