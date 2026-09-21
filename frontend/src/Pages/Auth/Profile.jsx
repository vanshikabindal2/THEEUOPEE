// import React, { useEffect, useRef, useState } from "react";
// import { ArrowRight } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Profile.css";
// const Profile = () => {
//     const location=useLocation();
//     const navigate=useNavigate();
//   const phone = location.state?.phone;
//   const [name,setName]=useState("");
//     const [email,setEmail]=useState("");
// const [loading,setLoading]=useState(false);
// const handleSubmit=async(e)=>{
//     e.preventDefault();
//     if(!name.trim()){
//         alert("please enter your name");
//         return;
//     }
//     if(!email.trim()){
//         alert("please enter your email");
//         return;
//     }
//     try{
//         setLoading(true);
//         const response=await fetch("http://localhost:5000/api/auth/complete-profile",
//             {
//                 method:"POST",
//                 headers:{
//                     "Content-Type":"application/json",
//                 },
//                 body:JSON.stringify({
//                     name,
//                     email,
//                     phone,
//                 }),
//             }
//         );
//         const data=await response.json();
//         console.log("complete profile:",data);
//         console.log("TOKEN:", data.token);
// console.log("USER:", data.user);
//         if(!data.success){
//             alert(data.message);
//             return;
//         }
//         localStorage.setItem("token",data.token);
//                 localStorage.setItem("user",JSON.stringify(data.user));
//                 window.dispatchEvent(new Event("authUpdated"));
//                 navigate("/");
//     }catch(error){
//         console.error("complete profile error:",error)
// alert("Unable to create account");

//     }finally{
//         setLoading(false);
//     }

// }
//   return (
//     <div className="profile-page">
//         <div className="profile-box">
//             <div className="profile-header">
//                 <h1>COMPLETE PROFILE</h1>
//                 <p>Just afew details to complete your account</p>
//             </div>
//             <form onSubmit={handleSubmit}>
//                 <label>NAME</label>
//                 <input type='text' placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)}/>

//                  <label>EMAIL</label>
//                 <input type='email' placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

//                  <label>PHONE NUMBER</label>
//                 <input type='text' value={`+${phone || ""}`}/>
//                 <button type='submit' disabled={loading}>{loading?"cREATE ACCOUNTt...":"CONTINUE"}
//                     {!loading &&(<ArrowRight size={18}/>)}
//                 </button>
//             </form>
//         </div>
      
//     </div>
//   )
// }

// export default Profile
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      // Login nahi hai
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Profile response:", data);

        if (!response.ok || !data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.dispatchEvent(new Event("authUpdated"));

          navigate("/login");
          return;
        }

        // Backend se user data
        setUser(data.user);

        // Latest user data localStorage me bhi save
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/");
  };

  // Loading
  if (loading) {
    return (
      <div className="profile-loading">
        LOADING PROFILE...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* BACK */}
        <button
          className="profile-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* HEADING */}
        <div className="profile-heading">
          <p>MY ACCOUNT</p>
          <h1>PROFILE</h1>
        </div>

        {/* USER HEADER */}
        <div className="profile-card">

          <div className="profile-avatar">
            <UserRound size={40} />
          </div>

          <div className="profile-welcome">
            <span>WELCOME BACK</span>

            <h2>
              {user.name || "User"}
            </h2>
          </div>

        </div>

        {/* PERSONAL INFORMATION */}
        <div className="profile-section">

          <div className="section-title">
            <h2>PERSONAL INFORMATION</h2>
          </div>

          <div className="profile-info-grid">

            {/* NAME */}
            <div className="profile-info-box">

              <div className="info-icon">
                <UserRound size={20} />
              </div>

              <div>
                <span>FULL NAME</span>

                <p>
                  {user.name || "Not available"}
                </p>
              </div>

            </div>

            {/* EMAIL */}
            <div className="profile-info-box">

              <div className="info-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>EMAIL ADDRESS</span>

                <p>
                  {user.email || "Not available"}
                </p>
              </div>

            </div>

            {/* PHONE */}
            <div className="profile-info-box">

              <div className="info-icon">
                <Phone size={20} />
              </div>

              <div>
                <span>PHONE NUMBER</span>

                <p>
                  +{user.phone}
                </p>
              </div>

            </div>

            {/* PHONE STATUS */}
            <div className="profile-info-box">

              <div className="info-icon">
                <Phone size={20} />
              </div>

              <div>
                <span>PHONE STATUS</span>

                <p className="verified">
                  {user.phoneVerified
                    ? "Verified"
                    : "Not Verified"}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="profile-section">

          <div className="section-title">
            <h2>ACCOUNT DETAILS</h2>
          </div>

          <div className="account-details">

            <div>
              <span>ACCOUNT ID</span>

              <p>
                {user._id}
              </p>
            </div>

            <div>
              <span>MEMBER SINCE</span>

              <p>
                {user.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "Not available"}
              </p>
            </div>

          </div>

        </div>

        {/* LOGOUT */}
        <div className="profile-actions">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            LOGOUT
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;