import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { moveEmailsToBin, sendEmail, toggleStarredEmails, deleteEmails, savedraftEmail} from "../../api";

const initialState = {
    emails: [],
    isLoading: false,
    error: null,
    type: null,
    query: '',
}


export const addNewEmail = createAsyncThunk('addNewEmail', async (form) => {
        const response = await sendEmail(form)
        return response.data;
    }
)

export const saveDraftEmail = createAsyncThunk('saveDraftEmail', async (form) => {
    const response = await savedraftEmail(form)
    return response.data;
}
)

export const toggleStarredEmail = createAsyncThunk('toggleStarredEmail', async({id, value}) => {
    const response = await toggleStarredEmails({id,value})
    return response.data;
})


export const movesEmailToBin = createAsyncThunk('movesEmailToBin', async (selectedEmails) => {
    const response = await moveEmailsToBin(selectedEmails)
    return response.data;
})

export const deleteEmail = createAsyncThunk('deleteEmail', async (selectedEmails) => {
    const response = await deleteEmails(selectedEmails)
    return response.data;
} )




const EmailReducer = createSlice({
    name: "emails",
    initialState,
    reducers: {
        fetchEmails: (state, action) => {
            state.emails = action.payload;
          },
        setQuery: (state, action) => {
            state.query = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewEmail.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(addNewEmail.fulfilled, (state, action) => {
                state.isLoading = false
                // Add any fetched emails to the array
                state.emails = state.emails.concat(action.payload.data)
                state.emails = state.emails.concat(action.payload.received)

            })
            .addCase(addNewEmail.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(saveDraftEmail.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(saveDraftEmail.fulfilled, (state, action) => {
                state.isLoading = false
                // Add any fetched emails to the array
                state.emails = state.emails.concat(action.payload.data)
            })
            .addCase(saveDraftEmail.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(toggleStarredEmail.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(toggleStarredEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                // map the state and check if id of email and update the value

                state.emails = state.emails.map(email => email._id === action.meta.arg.id
                      ? { ...email, email: action.meta.arg.value }
                      : email )

            })
            .addCase(toggleStarredEmail.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(movesEmailToBin.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(movesEmailToBin.fulfilled, (state, action) => {
                state.isLoading = false;
                // map the state and check if id of email and update the value
                if(action) {
                    console.log(action.meta.arg);
                    for (let i = 0; i<= action.meta.arg.length; i++) {
                        state.emails = state.emails.filter(email => email._id !== action.meta.arg[i])
                    }
                }

            })
            .addCase(movesEmailToBin.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(deleteEmail.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(deleteEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                // map the state and check if id of email and update the value
                if(action) {
                    console.log(action.meta.arg);
                    for (let i = 0; i<= action.meta.arg.length; i++) {
                        state.emails = state.emails.filter(email => email._id !== action.meta.arg[i])
                    }
                }
            })
            .addCase(deleteEmail.rejected, (state, action) => {
                state.error = action.error.message
            })
    }
});

export const { fetchEmails, setQuery } = EmailReducer.actions;

export default EmailReducer.reducer;

