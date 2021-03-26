import React, { FC } from 'react';
import * as styles from './Card.style';

const CardSection: FC = (props) => {
	return (<styles.CardSection>
		{props.children}
	</styles.CardSection>);
};

export default CardSection;