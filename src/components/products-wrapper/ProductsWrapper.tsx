import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/reducers/product.slice.reducer";

interface ProductsWrapperProps {

}

const ProductsWrapper: FC<ProductsWrapperProps> = (props) => {

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch])

	return <React.Fragment>{props.children}</React.Fragment>;
}

export default ProductsWrapper;