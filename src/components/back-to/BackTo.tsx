import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import * as styles from './BackTo.style';

interface BackToProps {
	route: string
}

const BackTo: FC<BackToProps> = (props) => {

	const history = useHistory();

	function backTo() {
		history.push(props.route);
	}

	return (
		<styles.BackTo className="u-marginBottomMedium u-textSecondary">
			<div className="backTo" onClick={backTo}>
				<i className="fpds-Icon fpds-Icon--small u-marginRightXXSmall">caretLeft</i>
				<span>{props.children}</span>
			</div>
		</styles.BackTo>
	);
}

export default BackTo;