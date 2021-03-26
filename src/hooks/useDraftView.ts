import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { setHasViewedDrafts } from "../redux/reducers/product.slice.reducer";
import useCurrentProduct from "./useCurrentProduct";
import ReleaseState from "enums/ReleaseState";

const useDraftView = () => {
	
	const { productId } = useCurrentProduct();
	const draftReleases = useSelector((state: RootState) => state.release.releases?.filter(r => r.status === ReleaseState.draft));
	const hasViewedDrafts = useSelector((state: RootState) => state.product.hasViewedDrafts[productId] === true);
	const dispatch = useDispatch();

	useEffect(() => {
	  if(draftReleases?.length && !hasViewedDrafts) {
		dispatch(setHasViewedDrafts(productId));
	  }
	}, [draftReleases, hasViewedDrafts, productId, dispatch]);
  

	return { productId, draftReleases, hasViewedDrafts };
}

export default useDraftView;