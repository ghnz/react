import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { setHasViewedReleases } from "../redux/reducers/product.slice.reducer";
import useCurrentProduct from "./useCurrentProduct";
import ReleaseState from "enums/ReleaseState";

const useReleasedView = () => {
	
	const { productId } = useCurrentProduct();
	const releases = useSelector((state: RootState) => state.release.releases?.filter(r => r.status === ReleaseState.published || r.status === ReleaseState.archived));
	const hasViewedReleases = useSelector((state: RootState) => state.product.hasViewedReleases[productId] === true);
	const dispatch = useDispatch();

	useEffect(() => {
	  if(releases && releases.length && !hasViewedReleases) {
		dispatch(setHasViewedReleases(productId));
	  }
	}, [releases, hasViewedReleases, productId, dispatch]);
  

	return { productId, releases, hasViewedReleases };
}

export default useReleasedView;