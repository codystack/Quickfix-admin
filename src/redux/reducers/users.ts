import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface UserI {
  users: any;
  admins: any;
  maleUsers: any;
  femaleUsers: any;
}

const initVal: UserI = {
  users: null,
  admins: null,
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
    setAdmins(state, action: PayloadAction<any>) {
      state.admins = action.payload;
    },
    setMaleUsers(state, action: PayloadAction<any>) {
      state.maleUsers = action.payload;
    },
    setFemaleUsers(state, action: PayloadAction<any>) {
      state.femaleUsers = action.payload;
    },
  },
});

export const { setUsers, setAdmins } = userSlice.actions


export default userSlice.reducer;