import UserCard from "@/components/user-card";

const AdminPage = () => {
  return (
    <div>
      <ul className="grid md:grid-cols-3 gap-4">
        <li>
          <UserCard type="Users" bgColor="primary" />
        </li>
        <li>
          <UserCard type="Admins" bgColor="secondary" />
        </li>
        <li>
          <UserCard type="Managers" bgColor="primary" />
        </li>
      </ul>
    </div>
  );
};

export default AdminPage;
