import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { api, urls } from "api";
import Product from 'types/Product';

export interface ProductState {
    currentProduct?: Product;
    products?: Product[];
    hasViewedDrafts: any;
    hasViewedReleases: any;
}

const initialState: ProductState = {
    currentProduct: undefined,
    products: undefined,
    hasViewedDrafts: {},
    hasViewedReleases: {},
};

const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {
        setCurrentProduct: (state, action: PayloadAction<Product | undefined>) => {
            return {
                ...state,
                currentProduct: action.payload,
            };
        },
        productsSuccess: (state, action: PayloadAction<Product[]>) => {
            return {
                ...state,
                products: action.payload,
            };
        },
        setHasViewedDrafts: (state, action: PayloadAction<string>) => {
            const hasViewedDrafts = { ...state.hasViewedDrafts };
            hasViewedDrafts[action.payload] = true;

            return {
                ...state,
                hasViewedDrafts,
            };
        },
        setHasViewedReleases: (state, action: PayloadAction<string>) => {
            const hasViewedReleases = { ...state.hasViewedReleases };
            hasViewedReleases[action.payload] = true;

            return {
                ...state,
                hasViewedReleases,
            };
        },
        updateCurrentProduct: (state, action: PayloadAction<Product>) => {
            if (state.products) {
                const products = [...state.products];
                const index = products.findIndex((p) => p.productId === action.payload.productId);
                products[index] = {...action.payload};

                return {
                    ...state,
                    products, 
                    currentProduct: products[index],
                };
            } else {
                return { ...state };
            }
        },
    },
});

const { productsSuccess } = productSlice.actions;

export const fetchProducts = () => async (dispatch: Dispatch<any>) => {
    try {
        await api.get(urls.getProducts()).then((response) => dispatch(productsSuccess(response.data)));
    } catch (e) {
        return console.error(e.message);
    }
};

export const { setCurrentProduct, setHasViewedDrafts, setHasViewedReleases, updateCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
