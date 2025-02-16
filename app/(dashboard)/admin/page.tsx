import CountBarChart from "@/components/count-bar-chart";
import CountChart from "@/components/count-chart";
import CountLineChart from "@/components/count-line-chart";
import UserCard from "@/components/user-card";
import userCardImageOne from "@/public/user-card-img-1.svg";
import userCardImageTwo from "@/public/user-card-img-2.svg";
import userCardImageThree from "@/public/user-card-img-3.svg";

const AdminPage = () => {
  return (
    <div className="grid gap-4">
      <ul className="grid md:grid-cols-3 gap-4">
        <li>
          <UserCard type="Users" bgColor="primary" image={userCardImageOne} />
        </li>
        <li>
          <UserCard
            type="Admins"
            bgColor="secondary"
            image={userCardImageTwo}
          />
        </li>
        <li>
          <UserCard
            type="Managers"
            bgColor="tertiary"
            image={userCardImageThree}
          />
        </li>
      </ul>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <CountChart />
        </div>
        <div>
          <CountBarChart />
        </div>
      </div>

      <div>
        <CountLineChart />
      </div>
    </div>
  );
};

export default AdminPage;
