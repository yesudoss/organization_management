export const isAuthenticated = () => {
    if (typeof window == "undefined") {
      return false;
    }
    const isSignedIn = getSessionData({ key: "isSignedIn" });
  
    if (isSignedIn) {
      return true;
    } else {
      return false;
    }
  };
  export const addSessionData = ({ key, value }) => {
    sessionStorage.setItem(key, value);
  };

  export const removeSessionData = ({ key }) => {
    sessionStorage.removeItem(key);
  };
  export const getSessionData = ({ key }) => {
    return sessionStorage.getItem(key);
  };

  export const getUserData = () => {
    if (sessionStorage.getItem("userData")) {
        var userData = sessionStorage.getItem("userData");
        return JSON.parse(userData);
    }
}
  
export const signOut = () => {
    if (typeof window !== "undefined") {
      removeSessionData({ key: "isSignedIn" });
      localStorage.removeItem("token", "");
      removeSessionData({ key: "userData" });
      removeSessionData({ key: "userid" });
      return;
    }
  };
  