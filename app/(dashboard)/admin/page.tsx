"use client";

import CountBarChart from "@/components/count-bar-chart";
import CountChart from "@/components/count-chart";
import CountLineChart from "@/components/count-line-chart";
import UserCard from "@/components/user-card";
import userCardImageOne from "@/public/user-card-img-1.svg";
import userCardImageTwo from "@/public/user-card-img-2.svg";
import userCardImageThree from "@/public/user-card-img-3.svg";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [managers, setManagers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/employees");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const counts = data.reduce(
          (
            acc: { users: number; admins: number; managers: number },
            user: { role: string }
          ) => {
            if (user.role === "USER") acc.users++;
            else if (user.role === "ADMIN") acc.admins++;
            else if (user.role === "MANAGER") acc.managers++;
            return acc;
          },
          { users: 0, admins: 0, managers: 0 }
        );

        setUsers(counts.users);
        setAdmins(counts.admins);
        setManagers(counts.managers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid gap-4">
      <ul className="grid md:grid-cols-3 gap-4">
        <li>
          <UserCard
            type="Accountants"
            bgColor="primary"
            image={userCardImageOne}
            amount={users}
            isLoading={isLoading}
          />
        </li>
        <li>
          <UserCard
            type="Admins"
            bgColor="secondary"
            image={userCardImageTwo}
            amount={admins}
            isLoading={isLoading}
          />
        </li>
        <li>
          <UserCard
            type="Managers"
            bgColor="tertiary"
            image={userCardImageThree}
            amount={managers}
            isLoading={isLoading}
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
