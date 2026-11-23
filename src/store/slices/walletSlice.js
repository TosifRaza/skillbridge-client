import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/wallet/me');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load wallet details');
    }
  }
);

export const createDepositOrder = createAsyncThunk(
  'wallet/createDepositOrder',
  async ({ amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wallet/create-deposit-order', { amount });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initiate deposit order');
    }
  }
);

export const verifyDepositPayment = createAsyncThunk(
  'wallet/verifyDepositPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wallet/verify-deposit', paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify deposit payment');
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  'wallet/withdrawFunds',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/wallet/withdraw', payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process withdrawal');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: {
      balance: 0,
      inEscrow: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      currency: 'INR',
    },
    transactions: [],
    payoutDetails: {},
    payoutStatus: 'NotConnected',
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearWalletNotice: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setLocalPayoutDetails: (state, action) => {
      state.payoutDetails = action.payload;
      state.payoutStatus = 'Active';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload.wallet || state.wallet;
        state.transactions = action.payload.transactions || [];
        state.payoutDetails = action.payload.payoutDetails || {};
        state.payoutStatus = action.payload.payoutStatus || 'NotConnected';
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deposit Order
      .addCase(createDepositOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createDepositOrder.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createDepositOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Verify Deposit
      .addCase(verifyDepositPayment.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyDepositPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.wallet = action.payload.wallet;
        if (action.payload.transaction) {
          state.transactions = [action.payload.transaction, ...state.transactions];
        }
        state.successMessage = `Deposit successful! Added to your SkillBridge Wallet via Razorpay.`;
      })
      .addCase(verifyDepositPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Withdraw
      .addCase(withdrawFunds.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.wallet = action.payload.wallet;
        if (action.payload.transaction) {
          state.transactions = [action.payload.transaction, ...state.transactions];
        }
        state.successMessage = 'Withdrawal processed successfully to your destination account!';
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWalletNotice, setLocalPayoutDetails } = walletSlice.actions;
export default walletSlice.reducer;
