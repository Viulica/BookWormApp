import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import AdminViewProfile from "./views/AdminViewProfile";
import ReaderViewProfile from "./views/ReaderViewProfile";
import AuthorViewProfile from "./views/AuthorViewProfile";

const ProfileRedirect: React.FC = () => {
  const [role, setRole] = useState<string>("");

  const fetchGetRole = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile/getRole`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.text();
          console.log(data);
          setRole(data);
        } else {
          console.log(await response.json());
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja uloge:", error);
      }
    }
  };

  useEffect(() => {
    fetchGetRole();
  });

  return (
    <>
      {role === "admin" && <AdminViewProfile role={ role} />}
      {role === "autor" && <AuthorViewProfile role={ role} />}
        {role === "čitatelj" && <ReaderViewProfile role={ role} />}
    </>
  );
};

export default ProfileRedirect;
