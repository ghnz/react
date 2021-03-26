import React, { FC } from 'react';
import * as styles from './Card.style';


const Card: FC = (props) => {
	return (<styles.Card className='fpds-Card'>
		{props.children}
	</styles.Card>);
}

export default Card