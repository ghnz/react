import React, { FC, useEffect } from 'react';
import { Switch } from "react-router";
import Route from '../../types/Route';
import Routes from '../../router/Routes';
import { useParams } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux'
import { setCurrentProduct } from '../../redux/reducers/product.slice.reducer';
import { RootState } from 'redux/reducers';
import { setReleases } from 'redux/reducers/release.slice.reducer';
import { fetchReleases } from 'services';
import useErrorHandler from 'hooks/useErrorHandler';
import { ErrorType } from 'redux/reducers/error.slice.reducer';

type ProductRootProps = {
  routes: Route[]
};

interface ProductRouterParams {
  productId: string
}

const ProductRoot: FC<ProductRootProps> = ({ routes }) => {

  const productId = useParams<ProductRouterParams>().productId;
  const products = useSelector((state: RootState) => state.product.products);
  const currentProduct = useSelector((state: RootState) => state.product.currentProduct)
  const dispatch = useDispatch();
  const { raiseError } = useErrorHandler();

  useEffect(() => {
    if(productId && products) {
      const product = products.find(p => p.productId === productId);
      if(product) {
        dispatch(setCurrentProduct(product));
      } else {
        raiseError(ErrorType.NotFound);
      }
    }
    return () => {
      dispatch(setCurrentProduct(undefined));
    }
  }, [productId, products, raiseError, dispatch]);

  useEffect(() => {
    if(currentProduct) {
      dispatch(fetchReleases(currentProduct.productId));
    } else {
      setReleases(undefined);
    }
    return () => {
      dispatch(setReleases(undefined));
    }
  }, [currentProduct, dispatch])

  return (
    <Switch>
      <Routes routes={routes} />
    </Switch>
  );
}

export default ProductRoot;