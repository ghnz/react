import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { PageSpinner } from '../spinners';
import { setTokenInterceptor } from '../../api';
import useProfile from "hooks/useProfile";
import jwt from 'jsonwebtoken';

interface Props { }

const AuthWrapper: FC<Props> = ({ children }) => {

	const {
		isLoading,
		isAuthenticated,
		error,
		getAccessTokenSilently,
		loginWithRedirect,
		getIdTokenClaims,
	} = useAuth0();

	const [hasToken, setHasToken] = useState(false);
	const {setIsAdmin} = useProfile();

	useEffect(() => {
		const initToken = async () => {
			const token = await getAccessTokenSilently();
			const idTokenClaims = await getIdTokenClaims();
			setTokenInterceptor(token, idTokenClaims.__raw);

			const decoded: any = jwt.decode(token) || {};

			setIsAdmin(decoded?.permissions?.find((p:any) => p === "allow:admin-actions") ? true : false);
			setHasToken(true);
		}

		if (isAuthenticated) {
			initToken().catch();
		}

	}, [isAuthenticated, getAccessTokenSilently, getIdTokenClaims, setIsAdmin]);

	if (isLoading) {
		return <PageSpinner />;
	}

	if (error) {
		return <div>Oops... {error.message}</div>;
	}

	if (!isAuthenticated) {
		loginWithRedirect();
		return <PageSpinner />;
	}

	if (!hasToken) {
		return <PageSpinner />;
	}

	return <React.Fragment>
		{children}
	</React.Fragment>;
}

export default AuthWrapper;