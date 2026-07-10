import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api/v1",

    timeout: 30000,

    headers: {
        "Content-Type": "application/json"
    },

    // Allow browser to send cookies
    withCredentials: true
});


// No need for Authorization header
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,

    (error) => {

        if (error.response) {

            switch (error.response.status) {

                case 401:

                    // Handled by AuthContext and React Router
                    console.error("Unauthorized");

                    break;

                case 403:

                    console.error("Access Denied");
                    break;

                case 500:

                    console.error("Internal Server Error");
                    break;

                default:
                    break;
            }

        }

        return Promise.reject(error);
    }
);


export default api;