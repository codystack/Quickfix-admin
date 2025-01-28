import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface UserI {
  users: any;
  usersList: any;
  admins: any;
  activities: any;
}

const initVal: UserI = {
  users: null,
  admins: null,
  usersList: null,
  activities: null,
};

const userSlice = createSlice({
  initialState: initVal,
  name: 'user',
  reducers: {
    setUsers(state, action: PayloadAction<any>) {
      state.users = action.payload;
    },
    setUsersList(state, action: PayloadAction<any>) {
      state.usersList = action.payload;
    },
    setAdmins(state, action: PayloadAction<any>) {
      state.admins = action.payload;
    },
    setActivities(state, action: PayloadAction<any>) {
      state.activities = action.payload;
    },
  },
});

export const { setUsers, setAdmins, setActivities, setUsersList } = userSlice.actions


export default userSlice.reducer;