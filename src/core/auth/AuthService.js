export const AuthService = {
  getCurrentUser: () => {
    const email = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
    const firstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
    const lastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";
    
    return {
      email,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      role: "Platform Founder"
    };
  },
  
  logout: () => {
    console.log("centralized auth session logged out.");
  }
};
