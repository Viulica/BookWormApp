import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import AdminViewProfile from "./views/AdminViewProfile";
import ReaderViewProfile from "./views/ReaderViewProfile";
import AuthorViewProfile from "./views/AuthorViewProfile";
import UserViewProfile from "./views/UserViewProfile";

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
          setRole(data);
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja uloge:", error);
      }
    }
    else {
      setRole("user");
    }
  };

  useEffect(() => {
    fetchGetRole();
  });

  return (
    <>
      {role === "admin" && <AdminViewProfile />}
      {role === "autor" && <AuthorViewProfile />}
      {role === "čitatelj" && <ReaderViewProfile />}
      {role === "user" && <UserViewProfile /> }
    </>
  );
};

export default ProfileRedirect;
