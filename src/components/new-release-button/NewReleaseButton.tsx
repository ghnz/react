import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { useHistory } from 'react-router-dom';

const NewReleaseButton: FC = () => {
	
	const productId = useSelector((state: RootState) => state.product.currentProduct?.productId) || "";
	const history = useHistory();

	function createNewRelease() {
		history.push(`/${productId}/draft-releases/new-release`);
	}

	return <button type="button" className="fpds-Button fpds-Button--primary" onClick={createNewRelease}>
		<i className="fpds-Icon fpds-Icon--small fpds-Button-iconStart">plus</i>
		<span>New Release</span>
	</button>;
};

export default NewReleaseButton;