import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentProduct } from "redux/reducers/product.slice.reducer";
import { RootState } from '../redux/reducers';

const useCurrentProduct = () => {

	const product = useSelector((state: RootState) => state.product.currentProduct);
	const productId = product?.productId || "";

	const dispatch = useDispatch(); 

	const afterReleasePublish = useCallback(
		() => {
			if(product) {
				dispatch(updateCurrentProduct({...product, 
					draftReleasesCount: product.draftReleasesCount-1,
					publishedReleasesCount: product.publishedReleasesCount+1
				}));
			}
		},
		[product, dispatch],
	)

	const afterReleaseDelete = useCallback(
		() => {
			if(product) {
				dispatch(updateCurrentProduct({...product, 
					draftReleasesCount: product.draftReleasesCount-1
				}));
			}
		},
		[product, dispatch],
	)

	const afterReleaseAdd = useCallback(
		() => {
			if(product) {
				dispatch(updateCurrentProduct({...product, 
					draftReleasesCount: product.draftReleasesCount+1
				}));
			}
		},
		[product, dispatch],
	)

	return { productId, product, afterReleasePublish, afterReleaseDelete, afterReleaseAdd };
}


export default useCurrentProduct;