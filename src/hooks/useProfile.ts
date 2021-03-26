
let isAdmin = false

const setIsAdmin = (state: boolean) =>  {
	isAdmin = state;
}

const useProfile = () => {

	
	return { isAdmin, setIsAdmin }

}

export default useProfile;