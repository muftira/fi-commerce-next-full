import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ViewState = {
  activeComponent: string;
};

const initialState: ViewState = {
  activeComponent: 'home',
};

export const viewSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveComponent: (state, action: PayloadAction<string>) => {
      state.activeComponent = action.payload;
    },
  },
});

export const { setActiveComponent } = viewSlice.actions;
export default viewSlice.reducer;
