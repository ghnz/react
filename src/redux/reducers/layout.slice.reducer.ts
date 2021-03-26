import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import LayoutMode from '../../enums/LayoutMode';


type IState = {
  mode: LayoutMode
};

const initialState: IState = {
  mode: LayoutMode.admin
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState: initialState,
  reducers: {
    setLayoutMode: (state, action: PayloadAction<LayoutMode>) => {
      return {
        ...state,
        mode: action.payload
      }
    }
  }
});

export const { setLayoutMode } = layoutSlice.actions;

export default layoutSlice.reducer;
