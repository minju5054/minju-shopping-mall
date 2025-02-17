import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { propTypes } from "react-bootstrap/esm/Image";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try{
      // const {name, minPrice, maxPrice} = query;
      // let params = {name};

      // if (minPrice) params.minPrice = minPrice;
      // if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get("/product", {params:{...query}});
      console.log("rrr", response);
      return response.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get(`/product/${id}`);
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error, "error");
    }
   }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/product", formData);
      dispatch(
        showToastMessage({message: "상품 생성 완료", status: "success"})
      );
      dispatch(getProductList({page:1}));
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error, "error");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try{
        const response = await api.delete(`/product/${id}`);
        dispatch(showToastMessage({message:"상품 삭제 완료", status:"success"}));
        dispatch(getProductList({page:1}));
    }catch(error){
        dispatch(showToastMessage(error.error, "error"));
        return rejectWithValue(error.error);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.put(`/product/${id}`, formData);
      dispatch(
        showToastMessage({message:"상품 수정 완료", status:"success"})
      );
      dispatch(getProductList({page:1}));   // 업데이트 된 데이터 호출
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";       // 에러 초기화
      state.success = true;   //  상품 생성을 성공했다? 다이얼로그를 닫고, 실패했다? 실패메세지를 다이어로그에 보여주고, 닫진 않음
    })
    .addCase(createProduct.rejected, (state, action) => 
    {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(getProductList.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(getProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.productList = action.payload.data;
      state.error = "";
      state.totalPageNum = action.payload.totalPageNum;
    })
    .addCase(getProductList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(editProduct.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(editProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.success = true;
    })
    .addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteProduct.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.success = true;
    })
    .addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getProductDetail.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(getProductDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.success = true;
      state.selectedProduct = action.payload;
    })
    .addCase(getProductDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
