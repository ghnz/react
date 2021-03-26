import React, { FC } from 'react';
import { SidebarProduct } from './SidebarProduct';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';

export const SidebarProducts: FC = () => {

	const products = useSelector((state: RootState) => state.product.products);
	
	return (
		<React.Fragment>
			{products?.map((product, index) => <SidebarProduct product={product} key={index} />)}
		</React.Fragment>
	);
};

