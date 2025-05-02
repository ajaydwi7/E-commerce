import { useReducer, useEffect } from "react";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  loading: true,
};

const actions = Object.freeze({
  SET_USER: "SET_USER",
  UPDATE_USER: "UPDATE_USER",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
});

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.payload, loading: false };
    case actions.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    case actions.LOGOUT:
      return { ...state, user: null, loading: false };
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const checkSession = async () => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include",
      });

      if (response.status === 401) {
        dispatch({ type: actions.LOGOUT });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Session check failed");
      }

      const userData = await response.json();
      dispatch({ type: actions.SET_USER, payload: userData });
    } catch (error) {
      console.error("Session Check Error:", error);
      dispatch({ type: actions.LOGOUT });
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };
  const register = async (userInfo) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful - don't check session
      toast.success("Registration successful! Please login.");
      return true; // Indicate success
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (userInfo) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      // Get user data from login response
      const { user } = await response.json();

      // Update state directly without checkSession
      dispatch({ type: actions.SET_USER, payload: user });
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
  const updateUser = async (updates) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${state.user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      dispatch({ type: actions.UPDATE_USER, payload: updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch({ type: actions.LOGOUT });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
      throw error;
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(passwords),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Password change failed");
      }

      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return {
    state,
    register,
    login,
    logout,
    updateUser,
    changePassword,
    checkSession,
  };
};

export default useAuth;
