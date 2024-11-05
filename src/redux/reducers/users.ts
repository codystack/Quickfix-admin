import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface UserI {
  users: any;
  maleUsers: any;
  femaleUsers: any;
}

const initVal: UserI = {
  users: null,
  maleUsers: null,
  femaleUsers: null
};

const userSlice = createSlice({
  initialState: initVal,
  name: 'user',
  reducers: {
    setUsers(state, action: PayloadAction<any>) {
      state.users = action.payload;
    },
    setMaleUsers(state, action: PayloadAction<any>) {
      state.maleUsers = action.payload;
    },
    setFemaleUsers(state, action: PayloadAction<any>) {
      state.femaleUsers = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions


export default userSlice.reducer;