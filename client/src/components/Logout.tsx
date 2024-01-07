// Logout.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {

   const navigate = useNavigate();

   useEffect(() => {
      sessionStorage.removeItem("token");
      setTimeout(() => {
         navigate('/login');
         window.location.reload();
      }, 1000)
   }, []);
  
   return (
      <div>
         <h1>Odjavljivanje...</h1>
      </div>
   );
};

export default Logout;
