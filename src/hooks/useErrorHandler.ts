import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { ErrorType, setError } from "redux/reducers/error.slice.reducer";

const useErrorHandler = () => {

	const error = useSelector((state: RootState) => state.error.error);
	const dispatch = useDispatch();

	const raiseError = useCallback((errorType: ErrorType) => {
		dispatch(setError(errorType));
	}, [dispatch]);

	const clearError = useCallback(() => {
		dispatch(setError(undefined));
	}, [dispatch]);

	return { error, raiseError, clearError };
}

export default useErrorHandler;