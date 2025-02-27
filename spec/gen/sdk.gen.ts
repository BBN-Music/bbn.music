// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-fetch';
import type { GetDropsByAdminData, GetDropsByAdminResponse, GetIdByDropsByAdminData, GetIdByDropsByAdminResponse, GetDownloadByFileByFilesByAdminData, DeleteIdByFilesByAdminData, GetGroupsByAdminData, GetGroupsByAdminResponse, GetPayoutsByAdminData, GetPayoutsByAdminResponse, GetUploadByPayoutsByAdminData, GetQueryBySearchByAdminData, GetQueryBySearchByAdminResponse, PostSyncMappingByAdminData, GetWalletsByAdminData, GetWalletsByAdminResponse, GetIdByWalletsByAdminData, GetIdByWalletsByAdminResponse, PatchIdByWalletsByAdminData, PostEmailByAuthData, GetTokenByFromUserInteractionByAuthData, PostCodeByProviderByOauthByAuthData, GetProviderByRedirectByAuthData, PostRefreshAccessTokenByAuthData, PostRegisterByAuthData, PostResetPasswordByAuthData, PostBugTrackData, GetWebhookByStatuspageByIntegrationData, PostWebhookByStatuspageByIntegrationData, PostMusicData, GetArtworkByDropByMusicData, PostReviewByDropByMusicData, GetServicesByDropByMusicData, PostTypeByTypeByDropByMusicData, GetArtistsByMusicData, GetArtistsByMusicResponse, PostArtistsByMusicData, PostArtistsByMusicResponse, GetDropsByMusicData, GetDropsByMusicResponse, GetDownloadByDropByDropsByMusicData, GetUploadByDropByDropsByMusicData, GetIdByDropsByMusicData, GetIdByDropsByMusicResponse, PatchIdByDropsByMusicData, PostShareByDropsByMusicData, PostShareByDropsByMusicResponse, DeleteIdByShareByDropsByMusicData, GetIdByShareByDropsByMusicData, GetIdByShareByDropsByMusicResponse, GetFulldropByMusicData, GetFulldropByMusicResponse, GetGenresByMusicData, GetGenresByMusicResponse, GetSlugByShareByMusicData, GetArtworkBySlugByShareByMusicData, GetSongsByMusicData, GetSongsByMusicResponse, PostSongsByMusicData, PostSongsByMusicResponse, GetUploadBySongsByMusicData, GetApplicationsByOauthData, GetApplicationsByOauthResponse, PostApplicationsByOauthData, GetDownloadByClientByApplicationsByOauthData, DeleteIdByApplicationsByOauthData, GetUploadByApplicationsByOauthData, PostAuthorizeByOauthData, PostTokenByOauthData, GetUserinfoByOauthData, GetUserinfoByOauthResponse, PostValidateByOauthData, GetPayoutsByPaymentData, GetPayoutsByPaymentResponse, GetIdByPayoutsByPaymentData, GetIdByPayoutsByPaymentResponse, GetStatsByPublicData, PutPlaceholderByTasksData, PutPlaceholderByTasksResponse, GetPictureByUserByUserData, PostResendVerifyEmailByMailByUserData, PostTokenByValidateByMailByUserData, GetUploadByAvatarBySetMeByUserData, PutUserByUserData, PutUserByUserResponse, PatchIdByUsersByUserData, GetWalletData, GetWalletResponse, PutWalletData, PutWalletResponse, GetHealthzData } from './types.gen.ts';
import { zGetDropsByAdminResponse, zGetIdByDropsByAdminResponse, zGetGroupsByAdminResponse, zGetPayoutsByAdminResponse, zGetQueryBySearchByAdminResponse, zGetWalletsByAdminResponse, zGetIdByWalletsByAdminResponse, zGetArtistsByMusicResponse, zPostArtistsByMusicResponse, zGetDropsByMusicResponse, zGetIdByDropsByMusicResponse, zPostShareByDropsByMusicResponse, zGetIdByShareByDropsByMusicResponse, zGetFulldropByMusicResponse, zGetGenresByMusicResponse, zGetSongsByMusicResponse, zPostSongsByMusicResponse, zGetApplicationsByOauthResponse, zGetUserinfoByOauthResponse, zGetPayoutsByPaymentResponse, zGetIdByPayoutsByPaymentResponse, zPutPlaceholderByTasksResponse, zPutUserByUserResponse, zGetWalletResponse, zPutWalletResponse } from './zod.gen.ts';
import { client as _heyApiClient } from './client.gen.ts';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
};

export const getDropsByAdmin = <ThrowOnError extends boolean = false>(options?: Options<GetDropsByAdminData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetDropsByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetDropsByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/drops',
        ...options
    });
};

export const getIdByDropsByAdmin = <ThrowOnError extends boolean = false>(options: Options<GetIdByDropsByAdminData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetIdByDropsByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetIdByDropsByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/drops/{id}',
        ...options
    });
};

export const getDownloadByFileByFilesByAdmin = <ThrowOnError extends boolean = false>(options: Options<GetDownloadByFileByFilesByAdminData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/admin/files/{fileId}/download',
        ...options
    });
};

export const deleteIdByFilesByAdmin = <ThrowOnError extends boolean = false>(options: Options<DeleteIdByFilesByAdminData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/admin/files/{id}',
        ...options
    });
};

export const getGroupsByAdmin = <ThrowOnError extends boolean = false>(options?: Options<GetGroupsByAdminData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetGroupsByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetGroupsByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/groups',
        ...options
    });
};

export const getPayoutsByAdmin = <ThrowOnError extends boolean = false>(options?: Options<GetPayoutsByAdminData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetPayoutsByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetPayoutsByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/payouts',
        ...options
    });
};

export const getUploadByPayoutsByAdmin = <ThrowOnError extends boolean = false>(options?: Options<GetUploadByPayoutsByAdminData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/admin/payouts/upload',
        ...options
    });
};

export const getQueryBySearchByAdmin = <ThrowOnError extends boolean = false>(options: Options<GetQueryBySearchByAdminData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetQueryBySearchByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetQueryBySearchByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/search/{query}',
        ...options
    });
};

export const postSyncMappingByAdmin = <ThrowOnError extends boolean = false>(options?: Options<PostSyncMappingByAdminData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/admin/sync_mapping',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getWalletsByAdmin = <ThrowOnError extends boolean = false>(options?: Options<GetWalletsByAdminData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetWalletsByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetWalletsByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/wallets',
        ...options
    });
};

export const getIdByWalletsByAdmin = <ThrowOnError extends boolean = false>(options: Options<GetIdByWalletsByAdminData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetIdByWalletsByAdminResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetIdByWalletsByAdminResponse.parseAsync(data);
        },
        url: '/api/@bbn/admin/wallets/{id}',
        ...options
    });
};

export const patchIdByWalletsByAdmin = <ThrowOnError extends boolean = false>(options: Options<PatchIdByWalletsByAdminData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/admin/wallets/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postEmailByAuth = <ThrowOnError extends boolean = false>(options?: Options<PostEmailByAuthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/email',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getTokenByFromUserInteractionByAuth = <ThrowOnError extends boolean = false>(options: Options<GetTokenByFromUserInteractionByAuthData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/from-user-interaction/{token}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postCodeByProviderByOauthByAuth = <ThrowOnError extends boolean = false>(options: Options<PostCodeByProviderByOauthByAuthData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/oauth/{provider}/{code}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getProviderByRedirectByAuth = <ThrowOnError extends boolean = false>(options: Options<GetProviderByRedirectByAuthData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/redirect/{provider}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postRefreshAccessTokenByAuth = <ThrowOnError extends boolean = false>(options?: Options<PostRefreshAccessTokenByAuthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/refresh-access-token',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postRegisterByAuth = <ThrowOnError extends boolean = false>(options?: Options<PostRegisterByAuthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/register',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postResetPasswordByAuth = <ThrowOnError extends boolean = false>(options?: Options<PostResetPasswordByAuthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/auth/reset-password',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postBugTrack = <ThrowOnError extends boolean = false>(options?: Options<PostBugTrackData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/bug-track/',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getWebhookByStatuspageByIntegration = <ThrowOnError extends boolean = false>(options?: Options<GetWebhookByStatuspageByIntegrationData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/integration/statuspage/webhook',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postWebhookByStatuspageByIntegration = <ThrowOnError extends boolean = false>(options?: Options<PostWebhookByStatuspageByIntegrationData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/integration/statuspage/webhook',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postMusic = <ThrowOnError extends boolean = false>(options?: Options<PostMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getArtworkByDropByMusic = <ThrowOnError extends boolean = false>(options: Options<GetArtworkByDropByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/{dropId}/artwork',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postReviewByDropByMusic = <ThrowOnError extends boolean = false>(options: Options<PostReviewByDropByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/{dropId}/review',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getServicesByDropByMusic = <ThrowOnError extends boolean = false>(options: Options<GetServicesByDropByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/{dropId}/services',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postTypeByTypeByDropByMusic = <ThrowOnError extends boolean = false>(options: Options<PostTypeByTypeByDropByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/{dropId}/type/{type}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getArtistsByMusic = <ThrowOnError extends boolean = false>(options?: Options<GetArtistsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetArtistsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetArtistsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/artists',
        ...options
    });
};

export const postArtistsByMusic = <ThrowOnError extends boolean = false>(options?: Options<PostArtistsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostArtistsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zPostArtistsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/artists',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getDropsByMusic = <ThrowOnError extends boolean = false>(options?: Options<GetDropsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetDropsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetDropsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/drops',
        ...options
    });
};

export const getDownloadByDropByDropsByMusic = <ThrowOnError extends boolean = false>(options: Options<GetDownloadByDropByDropsByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/drops/{dropId}/download',
        ...options
    });
};

export const getUploadByDropByDropsByMusic = <ThrowOnError extends boolean = false>(options: Options<GetUploadByDropByDropsByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/drops/{dropId}/upload',
        ...options
    });
};

export const getIdByDropsByMusic = <ThrowOnError extends boolean = false>(options: Options<GetIdByDropsByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetIdByDropsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetIdByDropsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/drops/{id}',
        ...options
    });
};

export const patchIdByDropsByMusic = <ThrowOnError extends boolean = false>(options: Options<PatchIdByDropsByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/drops/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postShareByDropsByMusic = <ThrowOnError extends boolean = false>(options?: Options<PostShareByDropsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostShareByDropsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zPostShareByDropsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/drops/share',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const deleteIdByShareByDropsByMusic = <ThrowOnError extends boolean = false>(options: Options<DeleteIdByShareByDropsByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/drops/share/{id}',
        ...options
    });
};

export const getIdByShareByDropsByMusic = <ThrowOnError extends boolean = false>(options: Options<GetIdByShareByDropsByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetIdByShareByDropsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetIdByShareByDropsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/drops/share/{id}',
        ...options
    });
};

export const getFulldropByMusic = <ThrowOnError extends boolean = false>(options?: Options<GetFulldropByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetFulldropByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetFulldropByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/fulldrop',
        ...options
    });
};

export const getGenresByMusic = <ThrowOnError extends boolean = false>(options?: Options<GetGenresByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetGenresByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetGenresByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/genres',
        ...options
    });
};

export const getSlugByShareByMusic = <ThrowOnError extends boolean = false>(options: Options<GetSlugByShareByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/music/share/{slug}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getArtworkBySlugByShareByMusic = <ThrowOnError extends boolean = false>(options: Options<GetArtworkBySlugByShareByMusicData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/music/share/{slug}/artwork',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getSongsByMusic = <ThrowOnError extends boolean = false>(options?: Options<GetSongsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetSongsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetSongsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/songs',
        ...options
    });
};

export const postSongsByMusic = <ThrowOnError extends boolean = false>(options?: Options<PostSongsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostSongsByMusicResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zPostSongsByMusicResponse.parseAsync(data);
        },
        url: '/api/@bbn/music/songs',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getUploadBySongsByMusic = <ThrowOnError extends boolean = false>(options?: Options<GetUploadBySongsByMusicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/music/songs/upload',
        ...options
    });
};

export const getApplicationsByOauth = <ThrowOnError extends boolean = false>(options?: Options<GetApplicationsByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetApplicationsByOauthResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetApplicationsByOauthResponse.parseAsync(data);
        },
        url: '/api/@bbn/oauth/applications',
        ...options
    });
};

export const postApplicationsByOauth = <ThrowOnError extends boolean = false>(options?: Options<PostApplicationsByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/oauth/applications',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getDownloadByClientByApplicationsByOauth = <ThrowOnError extends boolean = false>(options: Options<GetDownloadByClientByApplicationsByOauthData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/oauth/applications/{clientId}/download',
        ...options
    });
};

export const deleteIdByApplicationsByOauth = <ThrowOnError extends boolean = false>(options: Options<DeleteIdByApplicationsByOauthData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/oauth/applications/{id}',
        ...options
    });
};

export const getUploadByApplicationsByOauth = <ThrowOnError extends boolean = false>(options?: Options<GetUploadByApplicationsByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/oauth/applications/upload',
        ...options
    });
};

export const postAuthorizeByOauth = <ThrowOnError extends boolean = false>(options?: Options<PostAuthorizeByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/oauth/authorize',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postTokenByOauth = <ThrowOnError extends boolean = false>(options?: Options<PostTokenByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/oauth/token',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getUserinfoByOauth = <ThrowOnError extends boolean = false>(options?: Options<GetUserinfoByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetUserinfoByOauthResponse, unknown, ThrowOnError>({
        responseValidator: async (data) => {
            return await zGetUserinfoByOauthResponse.parseAsync(data);
        },
        url: '/api/@bbn/oauth/userinfo',
        ...options
    });
};

export const postValidateByOauth = <ThrowOnError extends boolean = false>(options?: Options<PostValidateByOauthData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/oauth/validate',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getPayoutsByPayment = <ThrowOnError extends boolean = false>(options?: Options<GetPayoutsByPaymentData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetPayoutsByPaymentResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetPayoutsByPaymentResponse.parseAsync(data);
        },
        url: '/api/@bbn/payment/payouts',
        ...options
    });
};

export const getIdByPayoutsByPayment = <ThrowOnError extends boolean = false>(options: Options<GetIdByPayoutsByPaymentData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetIdByPayoutsByPaymentResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetIdByPayoutsByPaymentResponse.parseAsync(data);
        },
        url: '/api/@bbn/payment/payouts/{id}',
        ...options
    });
};

export const getStatsByPublic = <ThrowOnError extends boolean = false>(options?: Options<GetStatsByPublicData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/public/stats',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const putPlaceholderByTasks = <ThrowOnError extends boolean = false>(options?: Options<PutPlaceholderByTasksData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).put<PutPlaceholderByTasksResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zPutPlaceholderByTasksResponse.parseAsync(data);
        },
        url: '/api/@bbn/tasks/placeholder',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getPictureByUserByUser = <ThrowOnError extends boolean = false>(options: Options<GetPictureByUserByUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/user/{userId}/picture',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postResendVerifyEmailByMailByUser = <ThrowOnError extends boolean = false>(options?: Options<PostResendVerifyEmailByMailByUserData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/user/mail/resend-verify-email',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postTokenByValidateByMailByUser = <ThrowOnError extends boolean = false>(options: Options<PostTokenByValidateByMailByUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/api/@bbn/user/mail/validate/{token}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getUploadByAvatarBySetMeByUser = <ThrowOnError extends boolean = false>(options?: Options<GetUploadByAvatarBySetMeByUserData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/user/set-me/avatar/upload',
        ...options
    });
};

export const putUserByUser = <ThrowOnError extends boolean = false>(options?: Options<PutUserByUserData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).put<PutUserByUserResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zPutUserByUserResponse.parseAsync(data);
        },
        url: '/api/@bbn/user/user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const patchIdByUsersByUser = <ThrowOnError extends boolean = false>(options: Options<PatchIdByUsersByUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).patch<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/api/@bbn/user/users/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getWallet = <ThrowOnError extends boolean = false>(options?: Options<GetWalletData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetWalletResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetWalletResponse.parseAsync(data);
        },
        url: '/api/@bbn/wallet/',
        ...options
    });
};

export const putWallet = <ThrowOnError extends boolean = false>(options?: Options<PutWalletData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).put<PutWalletResponse, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zPutWalletResponse.parseAsync(data);
        },
        url: '/api/@bbn/wallet/',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getHealthz = <ThrowOnError extends boolean = false>(options?: Options<GetHealthzData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/healthz',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};