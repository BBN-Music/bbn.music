// This file is auto-generated by @hey-api/openapi-ts

export type PayoutList = {
    period: string;
    sum: number;
};

export type AdminDrop = {
    gtin?: string;
    title?: string;
    artists?: Array<ArtistRef>;
    release?: string;
    language?: string;
    primaryGenre?: string;
    secondaryGenre?: string;
    compositionCopyright?: string;
    soundRecordingCopyright?: string;
    artwork?: ObjectId;
    songs?: Array<ObjectId>;
    comments?: string;
    _id?: ObjectId;
    user?: string;
    type?: DropType;
} & {
    accountType: AccountType;
    priority: number;
};

export type Drop = {
    gtin?: string;
    title: string;
    artists: Array<ArtistRef>;
    release: string;
    language: string;
    primaryGenre: string;
    secondaryGenre: string;
    compositionCopyright: string;
    soundRecordingCopyright: string;
    artwork?: ObjectId;
    songs: Array<ObjectId>;
    comments?: string;
    _id: ObjectId;
    user: ObjectId;
    type: DropType;
};

export type ArtistRef = {
    _id: ObjectId;
    type: 'PRIMARY' | 'FEATURING';
} | {
    name: string;
    type: 'PRODUCER' | 'SONGWRITER';
};

export type ObjectId = string;

export type DropType = 'PUBLISHED' | 'PUBLISHING' | 'PRIVATE' | 'UNDER_REVIEW' | 'UNSUBMITTED' | 'REVIEW_DECLINED';

export type AccountType = 'DEFAULT' | 'SUBSCRIBED' | 'VIP';

export type SingleAdminDrop = {
    gtin?: string;
    title?: string;
    artists?: Array<ArtistRef>;
    release?: string;
    language?: string;
    primaryGenre?: string;
    secondaryGenre?: string;
    compositionCopyright?: string;
    soundRecordingCopyright?: string;
    artwork?: ObjectId;
    songs?: Array<Song>;
    comments?: string;
    _id?: ObjectId;
    user?: ObjectId;
    type?: DropType;
    userInfo?: User;
    events?: unknown;
} & {
    artistList: Array<Artist>;
};

export type Song = {
    _id: ObjectId;
    user: ObjectId;
    isrc?: string;
    title: string;
    artists: Array<ArtistRef>;
    primaryGenre: string;
    secondaryGenre: string;
    year: number;
    country?: string;
    language: string;
    explicit: boolean;
    instrumental: boolean;
    file: ObjectId;
};

export type User = {
    _id: unknown;
    authentication?: Array<{
        type: 'webAuthn';
        id: string;
        authenticatorAttachement: 'cross-platform' | 'platform';
        publicKey: string;
    } | {
        type: 'oauth';
        provider: string;
        id: string;
    } | {
        type: 'password';
        salt: string;
        hash: string;
    }>;
    profile: {
        email: string;
        phone?: string;
        username: string;
        avatar?: unknown;
        verified: {
            email: boolean;
            phone?: boolean;
        };
    };
    permissions: Array<string>;
    groups: Array<ObjectId2>;
};

export type ObjectId2 = string;

export type Artist = {
    _id: ObjectId;
    name: string;
    users: Array<ObjectId>;
    avatar?: ObjectId;
    spotify?: string;
    apple?: string;
};

export type AdminWallet = {
    _id: ObjectId;
    transactions: Array<{
        amount: number;
        timestamp: string;
        type: PaymentType;
        description: string;
        counterParty: string;
    }>;
    cut: string;
    user: ObjectId;
    userName?: string;
    email?: string;
    balance?: {
        restrained: number;
        unrestrained: number;
    };
    stripeAccountId?: string;
    accountType: AccountType;
} & {
    email: string;
    userName: string;
    balance: {
        restrained: number;
        unrestrained: number;
    };
};

export type Wallet = {
    _id: ObjectId;
    transactions: Array<{
        amount: number;
        timestamp: string;
        type: PaymentType;
        description: string;
        counterParty: string;
    }>;
    cut: number;
    user: ObjectId;
    userName?: string;
    email?: string;
    balance?: {
        restrained: number;
        unrestrained: number;
    };
    stripeAccountId?: string;
    accountType: AccountType;
};

export type PaymentType = 'RESTRAINED' | 'UNRESTRAINED';

export type Group = {
    displayName: string;
    _id: ObjectId;
    permission: Array<string>;
};

export type SearchReturn = ({
    _index: 'drops';
    _source: {
        gtin?: string;
        title?: string;
        artists?: Array<ArtistRef>;
        release?: string;
        language?: string;
        primaryGenre?: string;
        secondaryGenre?: string;
        compositionCopyright?: string;
        soundRecordingCopyright?: string;
        artwork?: ObjectId;
        songs?: Array<ObjectId>;
        comments?: string;
        _id?: ObjectId;
        user?: ObjectId;
        type?: DropType;
    };
} | {
    _index: 'songs';
    _source: {
        _id?: ObjectId;
        user?: ObjectId;
        isrc?: string;
        title?: string;
        artists?: Array<ArtistRef>;
        primaryGenre?: string;
        secondaryGenre?: string;
        year?: number;
        country?: string;
        language?: string;
        explicit?: boolean;
        instrumental?: boolean;
        file?: ObjectId;
    };
} | {
    _index: 'users';
    _source: {
        _id: ObjectId;
        authentication?: Array<{
            type: 'webAuthn';
            id: string;
            authenticatorAttachement: 'cross-platform' | 'platform';
            publicKey: string;
        } | {
            type: 'oauth';
            provider: string;
            id: string;
        } | {
            type: 'password';
            salt: string;
            hash: string;
        }>;
        profile: {
            email: string;
            phone?: string;
            username: string;
            avatar?: ObjectId | string;
            verified: {
                email: boolean;
                phone?: boolean;
            };
        };
        permissions: Array<string>;
        groups: Array<ObjectId2>;
    };
} | {
    _index: 'wallets';
    _source: Wallet;
}) & {
    _id: string;
    _score: number;
};

export type FullDrop = {
    gtin?: string;
    title: string;
    artists: Array<ArtistRef>;
    release: string;
    language: string;
    primaryGenre: string;
    secondaryGenre: string;
    compositionCopyright: string;
    soundRecordingCopyright: string;
    artwork?: ObjectId;
    songs: Array<Song>;
    comments?: string;
    _id: ObjectId;
    user: ObjectId;
    type: DropType;
};

export type UpdateDrop = {
    gtin?: string;
    title?: string;
    artists?: Array<ArtistRef>;
    release?: string;
    language?: string;
    primaryGenre?: string;
    secondaryGenre?: string;
    compositionCopyright?: string;
    soundRecordingCopyright?: string;
    artwork?: string;
    songs?: Array<{
        _id: ObjectId;
        isrc?: string;
        title: string;
        artists: Array<ArtistRef>;
        primaryGenre: string;
        secondaryGenre: string;
        year: number;
        country?: string;
        language: string;
        explicit: boolean;
        instrumental: boolean;
    }>;
    comments?: string;
    type?: DropType;
};

export type Share = {
    _id: ObjectId;
    drop: ObjectId;
    slug: string;
    services: {
        [key: string]: string;
    };
};

export type OAuthApp = {
    _id: ObjectId;
    name: string;
    redirect: Array<string>;
    secret: string;
    icon: ObjectId;
    users: Array<ObjectId>;
};

export type PayoutResponse = {
    entries: Array<{
        isrc: string;
        data: Array<{
            store: string;
            territory: string;
            quantity: number;
            revenue: number;
        }>;
    }>;
    moneythisperiod: string;
    period: string;
    streams: number;
    _id: ObjectId2;
};

export type ArtistTypes = 'PRIMARY' | 'FEATURING' | 'SONGWRITER' | 'PRODUCER';

export type File = {
    _id: ObjectId;
    length: number;
    chunkSize: number;
    uploadDate: string;
    filename: string;
    metadata: {
        type: string;
    };
};

export type ReviewResponse = 'APPROVED' | 'DECLINE_COPYRIGHT' | 'DECLINE_MALICIOUS_ACTIVITY';

export type OAuthScopes = 'profile' | 'email' | 'phone';

export type RequestPayoutResponse = {
    type: 'createAccount';
    url: string;
} | {
    type: 'needDetails';
    missingDetails: Array<string>;
    url: string;
} | {
    type: 'success';
};

export type GetDropsByAdminData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/admin/drops';
};

export type GetDropsByAdminResponses = {
    /**
     * Successful operation
     */
    200: Array<AdminDrop>;
};

export type GetDropsByAdminResponse = GetDropsByAdminResponses[keyof GetDropsByAdminResponses];

export type GetIdByDropsByAdminData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/admin/drops/{id}';
};

export type GetIdByDropsByAdminResponses = {
    /**
     * Successful operation
     */
    200: SingleAdminDrop;
};

export type GetIdByDropsByAdminResponse = GetIdByDropsByAdminResponses[keyof GetIdByDropsByAdminResponses];

export type GetDownloadByFileByFilesByAdminData = {
    body?: never;
    path: {
        fileId: string;
    };
    query?: never;
    url: '/api/@bbn/admin/files/{fileId}/download';
};

export type GetDownloadByFileByFilesByAdminResponses = {
    /**
     * Successful operation
     */
    200: Blob | File;
};

export type GetDownloadByFileByFilesByAdminResponse = GetDownloadByFileByFilesByAdminResponses[keyof GetDownloadByFileByFilesByAdminResponses];

export type DeleteIdByFilesByAdminData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/admin/files/{id}';
};

export type GetGroupsByAdminData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/admin/groups';
};

export type GetGroupsByAdminResponses = {
    /**
     * Successful operation
     */
    200: Array<Group>;
};

export type GetGroupsByAdminResponse = GetGroupsByAdminResponses[keyof GetGroupsByAdminResponses];

export type GetPayoutsByAdminData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/admin/payouts';
};

export type GetPayoutsByAdminResponses = {
    /**
     * Successful operation
     */
    200: Array<PayoutList>;
};

export type GetPayoutsByAdminResponse = GetPayoutsByAdminResponses[keyof GetPayoutsByAdminResponses];

export type GetUploadByPayoutsByAdminData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/admin/payouts/upload';
};

export type GetQueryBySearchByAdminData = {
    body?: never;
    path: {
        query: string;
    };
    query?: never;
    url: '/api/@bbn/admin/search/{query}';
};

export type GetQueryBySearchByAdminResponses = {
    /**
     * Successful operation
     */
    200: Array<SearchReturn>;
};

export type GetQueryBySearchByAdminResponse = GetQueryBySearchByAdminResponses[keyof GetQueryBySearchByAdminResponses];

export type PostSyncMappingByAdminData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/admin/sync_mapping';
};

export type GetWalletsByAdminData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/admin/wallets';
};

export type GetWalletsByAdminResponses = {
    /**
     * Successful operation
     */
    200: Array<AdminWallet>;
};

export type GetWalletsByAdminResponse = GetWalletsByAdminResponses[keyof GetWalletsByAdminResponses];

export type GetIdByWalletsByAdminData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/admin/wallets/{id}';
};

export type GetIdByWalletsByAdminResponses = {
    /**
     * Successful operation
     */
    200: AdminWallet;
};

export type GetIdByWalletsByAdminResponse = GetIdByWalletsByAdminResponses[keyof GetIdByWalletsByAdminResponses];

export type PatchIdByWalletsByAdminData = {
    body?: {
        _id?: ObjectId;
        transactions?: Array<{
            amount: number;
            timestamp: string;
            type: PaymentType;
            description: string;
            counterParty: string;
        }>;
        cut?: string;
        user?: ObjectId;
        userName?: string;
        email?: string;
        balance?: {
            restrained: number;
            unrestrained: number;
        };
        stripeAccountId?: string;
        accountType?: AccountType;
    };
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/admin/wallets/{id}';
};

export type PostEmailByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/auth/email';
};

export type GetTokenByFromUserInteractionByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        token: string;
    };
    query?: never;
    url: '/api/@bbn/auth/from-user-interaction/{token}';
};

export type PostCodeByProviderByOauthByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        provider: string;
        code: string;
    };
    query?: never;
    url: '/api/@bbn/auth/oauth/{provider}/{code}';
};

export type GetProviderByRedirectByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        provider: string;
    };
    query?: never;
    url: '/api/@bbn/auth/redirect/{provider}';
};

export type PostRefreshAccessTokenByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/auth/refresh-access-token';
};

export type PostRegisterByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/auth/register';
};

export type PostResetPasswordByAuthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/auth/reset-password';
};

export type PostBugTrackData = {
    body?: {
        type: 'web-frontend';
        error: string;
        errorStack: string;
        platform?: string;
        platformVersion?: string;
        browserVersion?: string;
        browser?: string;
        userId?: string;
        location: string;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/bug-track/';
};

export type GetWebhookByStatuspageByIntegrationData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/integration/statuspage/webhook';
};

export type PostWebhookByStatuspageByIntegrationData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/integration/statuspage/webhook';
};

export type PostMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/music/';
};

export type GetArtworkByDropByMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        dropId: string;
    };
    query?: never;
    url: '/api/@bbn/music/{dropId}/artwork';
};

export type PostReviewByDropByMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        dropId: string;
    };
    query?: never;
    url: '/api/@bbn/music/{dropId}/review';
};

export type GetServicesByDropByMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        dropId: string;
    };
    query?: never;
    url: '/api/@bbn/music/{dropId}/services';
};

export type PostTypeByTypeByDropByMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        dropId: string;
        type: string;
    };
    query?: never;
    url: '/api/@bbn/music/{dropId}/type/{type}';
};

export type GetArtistsByMusicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/music/artists';
};

export type GetArtistsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Array<Artist>;
};

export type GetArtistsByMusicResponse = GetArtistsByMusicResponses[keyof GetArtistsByMusicResponses];

export type PostArtistsByMusicData = {
    body?: {
        name: string;
        spotify?: string;
        apple?: string;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/music/artists';
};

export type PostArtistsByMusicResponses = {
    /**
     * Successful operation
     */
    200: {
        id: ObjectId;
    };
};

export type PostArtistsByMusicResponse = PostArtistsByMusicResponses[keyof PostArtistsByMusicResponses];

export type GetDropsByMusicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/music/drops';
};

export type GetDropsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Array<{
        gtin?: string;
        title?: string;
        artists?: Array<ArtistRef>;
        release?: string;
        language?: string;
        primaryGenre?: string;
        secondaryGenre?: string;
        compositionCopyright?: string;
        soundRecordingCopyright?: string;
        artwork?: ObjectId;
        songs?: Array<ObjectId>;
        comments?: string;
        _id?: ObjectId;
        user?: ObjectId;
        type?: DropType;
    }>;
};

export type GetDropsByMusicResponse = GetDropsByMusicResponses[keyof GetDropsByMusicResponses];

export type PostDropByDropsByMusicData = {
    body?: {
        file: string;
        filename: string;
    };
    path: {
        dropId: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/{dropId}';
};

export type PostDropByDropsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Song;
};

export type PostDropByDropsByMusicResponse = PostDropByDropsByMusicResponses[keyof PostDropByDropsByMusicResponses];

export type GetDownloadByDropByDropsByMusicData = {
    body?: never;
    path: {
        dropId: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/{dropId}/download';
};

export type GetDownloadByDropByDropsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Blob | File;
};

export type GetDownloadByDropByDropsByMusicResponse = GetDownloadByDropByDropsByMusicResponses[keyof GetDownloadByDropByDropsByMusicResponses];

export type GetUploadByDropByDropsByMusicData = {
    body?: never;
    path: {
        dropId: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/{dropId}/upload';
};

export type GetIdByDropsByMusicData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/{id}';
};

export type GetIdByDropsByMusicResponses = {
    /**
     * Successful operation
     */
    200: {
        gtin?: string;
        title?: string;
        artists?: Array<ArtistRef>;
        release?: string;
        language?: string;
        primaryGenre?: string;
        secondaryGenre?: string;
        compositionCopyright?: string;
        soundRecordingCopyright?: string;
        artwork?: ObjectId;
        songs?: Array<Song>;
        comments?: string;
        _id?: ObjectId;
        user?: ObjectId;
        type?: DropType;
    };
};

export type GetIdByDropsByMusicResponse = GetIdByDropsByMusicResponses[keyof GetIdByDropsByMusicResponses];

export type PatchIdByDropsByMusicData = {
    body?: UpdateDrop;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/{id}';
};

export type PostShareByDropsByMusicData = {
    body?: {
        id: string;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/music/drops/share';
};

export type PostShareByDropsByMusicResponses = {
    /**
     * Successful operation
     */
    200: {
        drop: ObjectId;
        slug: string;
        services: {
            [key: string]: string;
        };
    };
};

export type PostShareByDropsByMusicResponse = PostShareByDropsByMusicResponses[keyof PostShareByDropsByMusicResponses];

export type DeleteIdByShareByDropsByMusicData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/share/{id}';
};

export type GetIdByShareByDropsByMusicData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/music/drops/share/{id}';
};

export type GetIdByShareByDropsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Share;
};

export type GetIdByShareByDropsByMusicResponse = GetIdByShareByDropsByMusicResponses[keyof GetIdByShareByDropsByMusicResponses];

export type GetFulldropByMusicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/music/fulldrop';
};

export type GetFulldropByMusicResponses = {
    /**
     * Successful operation
     */
    200: Array<FullDrop>;
};

export type GetFulldropByMusicResponse = GetFulldropByMusicResponses[keyof GetFulldropByMusicResponses];

export type GetGenresByMusicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/music/genres';
};

export type GetGenresByMusicResponses = {
    /**
     * Successful operation
     */
    200: {
        primary: Array<string>;
        secondary: {
            [key: string]: Array<string>;
        };
    };
};

export type GetGenresByMusicResponse = GetGenresByMusicResponses[keyof GetGenresByMusicResponses];

export type GetSlugByShareByMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        slug: string;
    };
    query?: never;
    url: '/api/@bbn/music/share/{slug}';
};

export type GetArtworkBySlugByShareByMusicData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        slug: string;
    };
    query?: never;
    url: '/api/@bbn/music/share/{slug}/artwork';
};

export type GetSongsByMusicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/music/songs';
};

export type GetSongsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Array<Song>;
};

export type GetSongsByMusicResponse = GetSongsByMusicResponses[keyof GetSongsByMusicResponses];

export type PostSongsByMusicData = {
    body?: {
        isrc?: string;
        title: string;
        artists: Array<ArtistRef>;
        primaryGenre: string;
        secondaryGenre: string;
        year: number;
        country?: string;
        language: string;
        explicit: boolean;
        instrumental: boolean;
        file: ObjectId;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/music/songs';
};

export type PostSongsByMusicResponses = {
    /**
     * Successful operation
     */
    200: {
        id: ObjectId;
    };
};

export type PostSongsByMusicResponse = PostSongsByMusicResponses[keyof PostSongsByMusicResponses];

export type GetDownloadBySongBySongsByMusicData = {
    body?: never;
    path: {
        songId: string;
    };
    query?: never;
    url: '/api/@bbn/music/songs/{songId}/download';
};

export type GetDownloadBySongBySongsByMusicResponses = {
    /**
     * Successful operation
     */
    200: Blob | File;
};

export type GetDownloadBySongBySongsByMusicResponse = GetDownloadBySongBySongsByMusicResponses[keyof GetDownloadBySongBySongsByMusicResponses];

export type GetUploadBySongsByMusicData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/music/songs/upload';
};

export type GetApplicationsByOauthData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/applications';
};

export type GetApplicationsByOauthResponses = {
    /**
     * Successful operation
     */
    200: Array<OAuthApp>;
};

export type GetApplicationsByOauthResponse = GetApplicationsByOauthResponses[keyof GetApplicationsByOauthResponses];

export type PostApplicationsByOauthData = {
    body?: {
        name: string;
        redirect: Array<string>;
        icon: ObjectId;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/applications';
};

export type PostApplicationsByOauthResponses = {
    /**
     * Successful operation
     */
    200: unknown;
};

export type GetDownloadByClientByApplicationsByOauthData = {
    body?: never;
    path: {
        clientId: string;
    };
    query?: never;
    url: '/api/@bbn/oauth/applications/{clientId}/download';
};

export type GetDownloadByClientByApplicationsByOauthResponses = {
    /**
     * Successful operation
     */
    200: Blob | File;
};

export type GetDownloadByClientByApplicationsByOauthResponse = GetDownloadByClientByApplicationsByOauthResponses[keyof GetDownloadByClientByApplicationsByOauthResponses];

export type DeleteIdByApplicationsByOauthData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/oauth/applications/{id}';
};

export type GetUploadByApplicationsByOauthData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/applications/upload';
};

export type PostAuthorizeByOauthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/authorize';
};

export type PostTokenByOauthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/token';
};

export type GetUserinfoByOauthData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/userinfo';
};

export type GetUserinfoByOauthResponses = {
    /**
     * Successful operation
     */
    200: {
        id: string;
        name: string;
        email: string;
        picture: string;
    };
};

export type GetUserinfoByOauthResponse = GetUserinfoByOauthResponses[keyof GetUserinfoByOauthResponses];

export type PostValidateByOauthData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/oauth/validate';
};

export type GetPayoutsByPaymentData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/payment/payouts';
};

export type GetPayoutsByPaymentResponses = {
    /**
     * Successful operation
     */
    200: Array<PayoutResponse>;
};

export type GetPayoutsByPaymentResponse = GetPayoutsByPaymentResponses[keyof GetPayoutsByPaymentResponses];

export type GetIdByPayoutsByPaymentData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/payment/payouts/{id}';
};

export type GetIdByPayoutsByPaymentResponses = {
    /**
     * Successful operation
     */
    200: PayoutResponse;
};

export type GetIdByPayoutsByPaymentResponse = GetIdByPayoutsByPaymentResponses[keyof GetIdByPayoutsByPaymentResponses];

export type GetStatsByPublicData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/public/stats';
};

export type PutPlaceholderByTasksData = {
    body?: {
        artistTypes: ArtistTypes;
        file: File;
        reviewResponse: ReviewResponse;
        oAuthScopes: OAuthScopes;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/tasks/placeholder';
};

export type PutPlaceholderByTasksResponses = {
    /**
     * Successful operation
     */
    200: {
        [key: string]: unknown;
    };
};

export type PutPlaceholderByTasksResponse = PutPlaceholderByTasksResponses[keyof PutPlaceholderByTasksResponses];

export type GetPictureByUserByUserData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        userId: string;
    };
    query?: never;
    url: '/api/@bbn/user/{userId}/picture';
};

export type PostResendVerifyEmailByMailByUserData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/user/mail/resend-verify-email';
};

export type PostTokenByValidateByMailByUserData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        token: string;
    };
    query?: never;
    url: '/api/@bbn/user/mail/validate/{token}';
};

export type PostTokenByValidateByPhoneByUserData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        token: string;
    };
    query?: never;
    url: '/api/@bbn/user/phone/validate/{token}';
};

export type GetUploadByAvatarBySetMeByUserData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/user/set-me/avatar/upload';
};

export type PutUserByUserData = {
    body?: {
        name: string;
        email: string;
        phone?: string;
        password?: string;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/user/user';
};

export type PutUserByUserResponses = {
    /**
     * Successful operation
     */
    200: {
        [key: string]: unknown;
    };
};

export type PutUserByUserResponse = PutUserByUserResponses[keyof PutUserByUserResponses];

export type PatchIdByUsersByUserData = {
    body?: {
        id: string;
        email?: string;
        name: string;
        password?: string;
        groups: Array<string>;
    };
    path: {
        id: string;
    };
    query?: never;
    url: '/api/@bbn/user/users/{id}';
};

export type GetWalletData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/wallet/';
};

export type GetWalletResponses = {
    /**
     * Successful operation
     */
    200: Wallet;
};

export type GetWalletResponse = GetWalletResponses[keyof GetWalletResponses];

export type PutWalletData = {
    body?: {
        amount: number;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/wallet/';
};

export type PutWalletResponses = {
    /**
     * Successful operation
     */
    200: RequestPayoutResponse;
};

export type PutWalletResponse = PutWalletResponses[keyof PutWalletResponses];

export type GetChatsByWhatsappData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/@bbn/whatsapp/chats';
};

export type GetChatsByWhatsappResponses = {
    /**
     * Successful operation
     */
    200: Array<unknown>;
};

export type GetChatsByWhatsappResponse = GetChatsByWhatsappResponses[keyof GetChatsByWhatsappResponses];

export type GetEventByWhatsappData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/whatsapp/event';
};

export type PostEventByWhatsappData = {
    body?: {
        [key: string]: unknown;
    };
    path?: never;
    query?: never;
    url: '/api/@bbn/whatsapp/event';
};

export type ClientOptions = {
    baseUrl: 'https://example.one/api' | (string & {});
};