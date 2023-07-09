import { createSlice } from "@reduxjs/toolkit";
import  { USER_DATA } from '../utils/AppConstant'

export const UserDataSlice = createSlice({
   name:USER_DATA ,
   initialState: {
      data: {}
   },
   reducers: {
      addUserData(state, action) {
         state.data=action.payload
      },
      removeUserData(state, action) {
         state.data={}
      },
   }


}) 
export const { addUserData,removeUserData } = UserDataSlice.actions
export default UserDataSlice.reducer