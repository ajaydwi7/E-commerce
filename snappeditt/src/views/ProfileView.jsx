import React from "react";
import SEO from "@/components/SEO/SEO";
import UserProfile from "@/components/Profile/Profile";


const ProfileView = () => {

  return (
    <div>
      <SEO
        title="Profile | SnappEditt"
        noindex={true}
      />
      <UserProfile />
    </div>
  )
}
export default ProfileView;