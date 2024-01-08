import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import UserViewShowBook from "./views/UserViewShowBook";
import ReaderViewShowBook from "./views/ReaderViewShowBook";
import AdminViewShowBook from "./views/AdminViewShowBook";
import AuthorViewShowBook from "./views/AuthorViewShowBook";

const ShowBookRedirect: React.FC = () => {
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
    } else {
      setRole("user");
    }
  };

  useEffect(() => {
    fetchGetRole();
  });
  return (
    <>
      {role === "admin" && <AdminViewShowBook />}
      {role === "autor" && <AuthorViewShowBook />}
      {role === "čitatelj" && <ReaderViewShowBook />}
      {role === "user" && <UserViewShowBook />}
    </>
  );
};

export default ShowBookRedirect;
