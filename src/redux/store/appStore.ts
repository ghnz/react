import createStore from './configureStore';
import { useDispatch } from 'react-redux'

const appStore = createStore();

export type AppDispatch = typeof appStore.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default appStore;