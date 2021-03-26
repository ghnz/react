import React, { FC } from 'react';
import * as styles from './Card.style';

const CardTable: FC = (props) => {
	return (<styles.CardTable className="fpds-Table">
		{props.children}
	</styles.CardTable>);
};

export default CardTable;