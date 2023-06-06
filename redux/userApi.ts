import { API, KEY } from '@/functions/api';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const userContent = createApi({
    reducerPath: 'userContent',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL
    }),
    endpoints: (builder) => ({
        getUserContentByName: builder.query({
            query: (name: string) => ({
                url: `content/${name}`,
                method: 'GET',
                headers: {
                    'api-key': KEY
                }
            })
        })
    })

});

export const userProfile = createApi({
    reducerPath: 'userProfile',
    baseQuery: fetchBaseQuery({
        baseUrl: API
    }), 
    endpoints: (build) => ({
        getUserProfile: build.query({
            query: () => ({
                method: 'GET',
                url: '/user-profile', 
                headers: {
                    'api-key': KEY,
                    'user-token': Cookies.get('TVnow_Login_Token')
                    }
            })
        })
    })
})

export const {useGetUserContentByNameQuery} = userContent;
export const {useGetUserProfileQuery} = userProfile;