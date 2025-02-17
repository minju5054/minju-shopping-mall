import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { update } from "@react-spring/web";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.post("/cart", {productId:id, size, qty:1});
      dispatch(showToastMessage({message: "카트에 아이템이 추가 됐습니다", status: "success"}));
      return response.data.cartItemQty;   
    }catch(error){
      dispatch(showToastMessage({message: "카트에 아이템 추가 실패", status: "error",}));
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/cart");
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.delete(`/cart/${id}`);
      dispatch(getCartList());     // 카트목록 업데이트
      return response.data.cartItemQty;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

// 쇼핑백 아이템 개수 변경 
export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try{
      const response = await api.put(`/cart/${id}`, {qty: value});
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/cart/qty");
      return response.data.qty;
    }catch(error){
      dispatch(showToastMessage({message: error, status: "error"}));
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty, 0
        );
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItemCount = action.payload;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload; // 최신 업데이트된 cartList 가져오기
        state.totalPrice = action.payload.reduce(
          // 각 항목(item)을 순회하며 total계산 
          (total, item) => total + item.productId.price * item.qty, 0
        );
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.cartItemCount = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
