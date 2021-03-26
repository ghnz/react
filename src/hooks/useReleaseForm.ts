import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRelease } from "redux/reducers/release.slice.reducer";
import { RootState } from "redux/reducers";
import { setEditReleaseState } from "redux/reducers/edit-release.slice.reducer";
import { isInvalid, isPristine, isSubmitting, reset, submit } from "redux-form";

const useReleaseForm = () => {

	const dispatch = useDispatch();
	const release = useSelector((state: RootState) => state.release.selectedRelease);
	const currentTab = useSelector((state: RootState) => state.editRelease.currentTab);
	const pristine = useSelector((state: RootState) => isPristine(currentTab as string)(state));
	const invalid = useSelector((state: RootState) => isInvalid(currentTab as string)(state));
	const submitting = useSelector((state: RootState) => isSubmitting(currentTab as string)(state));

	const updateModifiedOn = useCallback(
		() => {
			if(release) {
				dispatch(setRelease({ ...release, modifiedOn: (new Date()).toISOString() }))
			}
		},
		[dispatch, release],
	)

	const setCurrentTab = useCallback(
		(currentTab: string | undefined) => {
			dispatch(setEditReleaseState({currentTab}));
		},
		[dispatch],
	)	

	const handleSubmit = useCallback(() => {
		if (currentTab) {
			dispatch(submit(currentTab));
		}
	}, [dispatch, currentTab]);

	const handleReset = useCallback(() => {
		if (currentTab) {
			dispatch(reset(currentTab))
		}
	}, [dispatch, currentTab]);

	return {release, currentTab, pristine, invalid, submitting, updateModifiedOn, setCurrentTab, handleSubmit, handleReset};
}

export default useReleaseForm;