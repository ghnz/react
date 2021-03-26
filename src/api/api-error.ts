import { AxiosResponse } from "axios";

class ApiError extends Error {
	errors: string[];
  
	constructor(message: string, response: AxiosResponse<any>) {
	  super(message);
	  this.errors = response?.data?.messages || ['An unknown error occured in the API'];
	}
  }

  export default ApiError;