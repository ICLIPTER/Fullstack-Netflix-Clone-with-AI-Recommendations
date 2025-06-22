import {create} from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000";

export const useAuthStore = create((set) => ({

    user:null,
    isloading: false,
    error:null,
    message:null,
    fetchinguser: true,

    signup: async (username, email, password) => {
        set({isloading:true, message:null,});

        try{
            const response = await axios.post(`${API_URL}/api/signup`, {
                username,
                email,
                password,
            });
            set({user: response.data.user, isloading: false})

        } catch (error) {
            set({isloading:false, error: error.response.data.message || "Somthing went wrong"});

            throw error;
        }

    },

    login: async (username, password) => {
        set({isloading:true, message:null,});

        try {
            const response = await axios.post(`${API_URL}/api/login`, {
    username,
    password,
}, {
    withCredentials: true
});
            const {user, message} = response.data;

            set({user,
                message,
                isloading: false,});

                return {user, message};

        } catch (error) {
            set({isloading:false, error: error.response.data.message || "Somthing went wrong"});

            throw error;
        }

    },

   fetchUser: async () => {
  set({ fetchingUser: true, error: null });

  try {
    const response = await axios.get(`${API_URL}/api/fetch-user`, {
      withCredentials: true,
    });

    set({
      user: response.data.user,
      fetchingUser: false,
    });
  } catch (error) {
    const message = error.response?.data?.message;

    if (message === "No token provided") {
      set({ fetchingUser: false });
    } else {
      set({
        error: message || "Error fetching user",
        fetchingUser: false,
      });
    }
  }
},


    logout: async () => {
  set({ isloading: true, error: null, message: null });

  try {
    const response = await axios.post(`${API_URL}/api/logout`, {}, {
      withCredentials: true,
    });

    const { message } = response.data;

    set({
      message,
      isloading: false,
      user: null,
      error: null,
    }); 

    return message;
  } catch (error) {
    set({
      isloading: false,
      error: error.response?.data?.message || "Error logging out",
    });

    throw error;
  }
}


}));
