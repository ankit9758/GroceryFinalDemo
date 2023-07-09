const { configureStore } = require('@reduxjs/toolkit')

import AddressReducers from './AddressSlice'
import UserReducers from './UserDataSlice'

export const store = configureStore({
  reducer: {
    userData:UserReducers,
    address: AddressReducers,
  }
})