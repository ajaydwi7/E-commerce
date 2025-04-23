import { useReducer } from "react";
import { toast } from "react-toastify";
import {
  setExpirationDate,
  getUserFromLocalStorage,
} from "../helpers/checkExpiration";

const initialState = {
  user: getUserFromLocalStorage() || null,
};
const actions = Object.freeze({
  SET_USER: "SET_USER",
  UPDATE_USER: "UPDATE_USER",
  LOGOUT: "LOGOUT",
});

const reducer = (state, action) => {
  if (action.type == actions.SET_USER) {
    return { ...state, user: action.user };
  }
  if (action.type == actions.UPDATE_USER) {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.updates,
      },
    };
  }
  if (action.type == actions.LOGOUT) {
    return { ...state, user: null };
  }
  return state;
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
        // Handle duplicate email error specifically
        const errorMessage = data.error?.includes("already registered")
          ? "Email already registered"
          : data.error || "Registration failed";

        throw new Error(errorMessage);
      }

      if (data.user) {
        dispatch({ type: actions.SET_USER, user: data.user });
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Registration successful");
      }
    } catch (error) {
      // Fix toast error syntax
      toast.error(error.message || "There was a problem registering");
    }
  };

  const login = async (userInfo) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure credentials are included
        body: JSON.stringify(userInfo),
      });
      const user = await response.json();
      if (user.error) {
        toast.error(user.error);
      } else if (user.user) {
        dispatch({ type: actions.SET_USER, user: user.user });
        user.user.expirationDate = setExpirationDate(7);
        localStorage.setItem("user", JSON.stringify(user.user));
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error("There was a problem logging in, try again");
    }
  };

  const updateUser = (updates) => {
    dispatch({ type: actions.UPDATE_USER, updates });
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    localStorage.removeItem("user");
    dispatch({ type: actions.LOGOUT });
  };

  return { state, register, login, updateUser, logout };
};

export default useAuth;
