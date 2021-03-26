import axios from "axios";
import { ErrorType, setError } from "redux/reducers/error.slice.reducer";
import appStore from "redux/store/appStore";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: `${baseUrl}/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    params: {},
});

api.interceptors.response.use(
    (request) => request,
    (error) => {
        const { dispatch } = appStore;
        if (!error.response) {
            dispatch(setError(ErrorType.ConnectionRefused));
        } else {
            const { status } = error.response;
            if (status === ErrorType.Unauthorized || status === ErrorType.Forbidden || status === ErrorType.NotFound) {
                dispatch(setError(status));
            }
        }
        return Promise.reject(error);
    },
);

const setTokenInterceptor = (accessToken: string, idToken: string) => {
    api.interceptors.request.use((request) => {
        if (accessToken) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (idToken) {
            request.headers["fphcare-identity"] = idToken;
        }
        return request;
    });
};

export { setTokenInterceptor };

export default api;
