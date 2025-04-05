// This file is auto-generated by @hey-api/openapi-ts

import { z } from 'zod/mod.ts';

export const zPayoutList = z.object({
    period: z.string(),
    sum: z.number()
});

export const zAdminDrop = z.object({
    gtin: z.string().optional(),
    title: z.string().optional(),
    artists: z.array(z.union([
        z.object({
            _id: z.string(),
            type: z.union([
                z.literal('PRIMARY'),
                z.literal('FEATURING')
            ])
        }),
        z.object({
            name: z.string(),
            type: z.union([
                z.literal('PRODUCER'),
                z.literal('SONGWRITER')
            ])
        })
    ])).optional(),
    release: z.string().date().optional(),
    language: z.string().optional(),
    primaryGenre: z.string().optional(),
    secondaryGenre: z.string().optional(),
    compositionCopyright: z.string().optional(),
    soundRecordingCopyright: z.string().optional(),
    artwork: z.string().optional(),
    songs: z.array(z.string()).optional(),
    comments: z.string().optional(),
    _id: z.string().optional(),
    user: z.string().optional(),
    type: z.enum([
        'PUBLISHED',
        'PUBLISHING',
        'PRIVATE',
        'UNDER_REVIEW',
        'UNSUBMITTED',
        'REVIEW_DECLINED'
    ]).optional()
}).merge(z.object({
    accountType: z.enum([
        'DEFAULT',
        'SUBSCRIBED',
        'VIP'
    ]),
    priority: z.number()
}));

export const zDrop = z.object({
    gtin: z.string().optional(),
    title: z.string(),
    artists: z.array(z.union([
        z.object({
            _id: z.string(),
            type: z.union([
                z.literal('PRIMARY'),
                z.literal('FEATURING')
            ])
        }),
        z.object({
            name: z.string(),
            type: z.union([
                z.literal('PRODUCER'),
                z.literal('SONGWRITER')
            ])
        })
    ])),
    release: z.string().date(),
    language: z.string(),
    primaryGenre: z.string(),
    secondaryGenre: z.string(),
    compositionCopyright: z.string(),
    soundRecordingCopyright: z.string(),
    artwork: z.string().optional(),
    songs: z.array(z.string()),
    comments: z.string().optional(),
    _id: z.string(),
    user: z.string(),
    type: z.enum([
        'PUBLISHED',
        'PUBLISHING',
        'PRIVATE',
        'UNDER_REVIEW',
        'UNSUBMITTED',
        'REVIEW_DECLINED'
    ])
});

export const zArtistRef = z.union([
    z.object({
        _id: z.string(),
        type: z.union([
            z.literal('PRIMARY'),
            z.literal('FEATURING')
        ])
    }),
    z.object({
        name: z.string(),
        type: z.union([
            z.literal('PRODUCER'),
            z.literal('SONGWRITER')
        ])
    })
]);

export const zObjectId = z.string();

export const zDropType = z.enum([
    'PUBLISHED',
    'PUBLISHING',
    'PRIVATE',
    'UNDER_REVIEW',
    'UNSUBMITTED',
    'REVIEW_DECLINED'
]);

export const zAccountType = z.enum([
    'DEFAULT',
    'SUBSCRIBED',
    'VIP'
]);

export const zSong = z.object({
    _id: zObjectId,
    user: zObjectId,
    isrc: z.string().optional(),
    title: z.string(),
    artists: z.array(zArtistRef),
    primaryGenre: z.string(),
    secondaryGenre: z.string(),
    year: z.number(),
    country: z.string().optional(),
    language: z.string(),
    explicit: z.boolean(),
    instrumental: z.boolean(),
    file: zObjectId
});

export const zUser = z.object({
    _id: z.unknown(),
    authentication: z.array(z.unknown()).optional(),
    profile: z.object({
        email: z.string(),
        phone: z.string().optional(),
        username: z.string(),
        avatar: z.unknown().optional(),
        verified: z.object({
            email: z.boolean(),
            phone: z.boolean().optional()
        })
    }),
    permissions: z.array(z.string()),
    groups: z.array(z.string())
});

export const zObjectId2 = z.string();

export const zArtist = z.object({
    _id: zObjectId,
    name: z.string(),
    users: z.array(zObjectId),
    avatar: zObjectId.optional(),
    spotify: z.string().optional(),
    apple: z.string().optional()
});

export const zAdminWallet = z.object({
    _id: zObjectId,
    transactions: z.array(z.object({
        amount: z.number(),
        timestamp: z.string(),
        type: z.enum([
            'RESTRAINED',
            'UNRESTRAINED'
        ]),
        description: z.string(),
        counterParty: z.string()
    })),
    cut: z.string(),
    user: zObjectId,
    userName: z.string().optional(),
    email: z.string().optional(),
    balance: z.object({
        restrained: z.number(),
        unrestrained: z.number()
    }).optional(),
    stripeAccountId: z.string().optional(),
    accountType: zAccountType
}).merge(z.object({
    email: z.string().email(),
    userName: z.string(),
    balance: z.object({
        restrained: z.number(),
        unrestrained: z.number()
    })
}));

export const zWallet = z.object({
    _id: zObjectId,
    transactions: z.array(z.object({
        amount: z.number(),
        timestamp: z.string(),
        type: z.enum([
            'RESTRAINED',
            'UNRESTRAINED'
        ]),
        description: z.string(),
        counterParty: z.string()
    })),
    cut: z.number(),
    user: zObjectId,
    userName: z.string().optional(),
    email: z.string().optional(),
    balance: z.object({
        restrained: z.number(),
        unrestrained: z.number()
    }).optional(),
    stripeAccountId: z.string().optional(),
    accountType: zAccountType
});

export const zPaymentType = z.enum([
    'RESTRAINED',
    'UNRESTRAINED'
]);

export const zGroup = z.object({
    displayName: z.string(),
    _id: zObjectId,
    permission: z.array(z.string())
});

export const zSearchReturn = z.intersection(z.union([
    z.object({
        _index: z.literal('drops'),
        _source: z.object({
            gtin: z.string().optional(),
            title: z.string().optional(),
            artists: z.array(zArtistRef).optional(),
            release: z.string().date().optional(),
            language: z.string().optional(),
            primaryGenre: z.string().optional(),
            secondaryGenre: z.string().optional(),
            compositionCopyright: z.string().optional(),
            soundRecordingCopyright: z.string().optional(),
            artwork: zObjectId.optional(),
            songs: z.array(zObjectId).optional(),
            comments: z.string().optional(),
            _id: zObjectId.optional(),
            user: zObjectId.optional(),
            type: zDropType.optional()
        })
    }),
    z.object({
        _index: z.literal('songs'),
        _source: z.object({
            _id: zObjectId.optional(),
            user: zObjectId.optional(),
            isrc: z.string().optional(),
            title: z.string().optional(),
            artists: z.array(zArtistRef).optional(),
            primaryGenre: z.string().optional(),
            secondaryGenre: z.string().optional(),
            year: z.number().optional(),
            country: z.string().optional(),
            language: z.string().optional(),
            explicit: z.boolean().optional(),
            instrumental: z.boolean().optional(),
            file: zObjectId.optional()
        })
    }),
    z.object({
        _index: z.literal('users'),
        _source: z.object({
            _id: zObjectId,
            authentication: z.array(z.unknown()).optional(),
            profile: z.object({
                email: z.string(),
                phone: z.string().optional(),
                username: z.string(),
                avatar: z.union([
                    zObjectId,
                    z.string()
                ]).optional(),
                verified: z.object({
                    email: z.boolean(),
                    phone: z.boolean().optional()
                })
            }),
            permissions: z.array(z.string()),
            groups: z.array(zObjectId2)
        })
    }),
    z.object({
        _index: z.literal('wallets'),
        _source: zWallet
    })
]), z.object({
    _id: z.string(),
    _score: z.number()
}));

export const zFullDrop = z.object({
    gtin: z.string().optional(),
    title: z.string(),
    artists: z.array(zArtistRef),
    release: z.string().date(),
    language: z.string(),
    primaryGenre: z.string(),
    secondaryGenre: z.string(),
    compositionCopyright: z.string(),
    soundRecordingCopyright: z.string(),
    artwork: zObjectId.optional(),
    songs: z.array(zSong),
    comments: z.string().optional(),
    _id: zObjectId,
    user: zObjectId,
    type: zDropType
});

export const zUpdateDrop = z.object({
    gtin: z.string().optional(),
    title: z.string().optional(),
    artists: z.array(zArtistRef).optional(),
    release: z.string().date().optional(),
    language: z.string().optional(),
    primaryGenre: z.string().optional(),
    secondaryGenre: z.string().optional(),
    compositionCopyright: z.string().optional(),
    soundRecordingCopyright: z.string().optional(),
    artwork: z.string().optional(),
    songs: z.array(z.object({
        _id: zObjectId,
        isrc: z.string().optional(),
        title: z.string(),
        artists: z.array(zArtistRef),
        primaryGenre: z.string(),
        secondaryGenre: z.string(),
        year: z.number(),
        country: z.string().optional(),
        language: z.string(),
        explicit: z.boolean(),
        instrumental: z.boolean()
    })).optional(),
    comments: z.string().optional(),
    type: zDropType.optional()
});

export const zShare = z.object({
    _id: zObjectId,
    drop: zObjectId,
    slug: z.string(),
    services: z.object({})
});

export const zOAuthApp = z.object({
    _id: zObjectId,
    name: z.string(),
    redirect: z.array(z.string().url()),
    secret: z.string(),
    icon: zObjectId,
    users: z.array(zObjectId)
});

export const zPayoutResponse = z.object({
    entries: z.array(z.object({
        isrc: z.string(),
        data: z.array(z.object({
            store: z.string(),
            territory: z.string(),
            quantity: z.number(),
            revenue: z.number()
        }))
    })),
    moneythisperiod: z.string(),
    period: z.string(),
    streams: z.number(),
    _id: zObjectId2
});

export const zArtistTypes = z.enum([
    'PRIMARY',
    'FEATURING',
    'SONGWRITER',
    'PRODUCER'
]);

export const zFile = z.object({
    _id: zObjectId,
    length: z.number(),
    chunkSize: z.number(),
    uploadDate: z.string(),
    filename: z.string(),
    metadata: z.object({
        type: z.string()
    })
});

export const zReviewResponse = z.enum([
    'APPROVED',
    'DECLINE_COPYRIGHT',
    'DECLINE_MALICIOUS_ACTIVITY'
]);

export const zOAuthScopes = z.enum([
    'profile',
    'email',
    'phone'
]);

export const zRequestPayoutResponse = z.union([
    z.object({
        type: z.literal('createAccount'),
        url: z.string()
    }),
    z.object({
        type: z.literal('needDetails'),
        missingDetails: z.array(z.string()),
        url: z.string()
    }),
    z.object({
        type: z.literal('success')
    })
]);

export const zGetDropsByAdminResponse = z.array(zAdminDrop);

export const zGetIdByDropsByAdminResponse = z.object({
    gtin: z.string().optional(),
    title: z.string().optional(),
    artists: z.array(zArtistRef).optional(),
    release: z.string().date().optional(),
    language: z.string().optional(),
    primaryGenre: z.string().optional(),
    secondaryGenre: z.string().optional(),
    compositionCopyright: z.string().optional(),
    soundRecordingCopyright: z.string().optional(),
    artwork: zObjectId.optional(),
    songs: z.array(zSong).optional(),
    comments: z.string().optional(),
    _id: zObjectId.optional(),
    user: zUser.optional(),
    type: zDropType.optional(),
    events: z.unknown().optional()
}).merge(z.object({
    artistList: z.array(zArtist)
}));

export const zGetDownloadByFileByFilesByAdminResponse = z.string();

export const zGetGroupsByAdminResponse = z.array(zGroup);

export const zGetPayoutsByAdminResponse = z.array(zPayoutList);

export const zGetQueryBySearchByAdminResponse = z.array(zSearchReturn);

export const zGetWalletsByAdminResponse = z.array(zAdminWallet);

export const zGetIdByWalletsByAdminResponse = zAdminWallet;

export const zGetArtistsByMusicResponse = z.array(zArtist);

export const zPostArtistsByMusicResponse = z.object({
    id: zObjectId
});

export const zGetDropsByMusicResponse = z.array(z.object({
    gtin: z.string().optional(),
    title: z.string().optional(),
    artists: z.array(zArtistRef).optional(),
    release: z.string().date().optional(),
    language: z.string().optional(),
    primaryGenre: z.string().optional(),
    secondaryGenre: z.string().optional(),
    compositionCopyright: z.string().optional(),
    soundRecordingCopyright: z.string().optional(),
    artwork: zObjectId.optional(),
    songs: z.array(zObjectId).optional(),
    comments: z.string().optional(),
    _id: zObjectId.optional(),
    user: zObjectId.optional(),
    type: zDropType.optional()
}));

export const zPostDropByDropsByMusicResponse = zSong;

export const zGetDownloadByDropByDropsByMusicResponse = z.string();

export const zGetIdByDropsByMusicResponse = z.object({
    gtin: z.string().optional(),
    title: z.string().optional(),
    artists: z.array(zArtistRef).optional(),
    release: z.string().date().optional(),
    language: z.string().optional(),
    primaryGenre: z.string().optional(),
    secondaryGenre: z.string().optional(),
    compositionCopyright: z.string().optional(),
    soundRecordingCopyright: z.string().optional(),
    artwork: zObjectId.optional(),
    songs: z.array(zSong).optional(),
    comments: z.string().optional(),
    _id: zObjectId.optional(),
    user: zObjectId.optional(),
    type: zDropType.optional()
});

export const zPostShareByDropsByMusicResponse = z.object({
    slug: z.string()
});

export const zGetIdByShareByDropsByMusicResponse = zShare;

export const zGetFulldropByMusicResponse = z.array(zFullDrop);

export const zGetGenresByMusicResponse = z.object({
    primary: z.array(z.string()),
    secondary: z.object({})
});

export const zGetSongsByMusicResponse = z.array(zSong);

export const zGetDownloadBySongBySongsByMusicResponse = z.string();

export const zGetApplicationsByOauthResponse = z.array(zOAuthApp);

export const zGetDownloadByClientByApplicationsByOauthResponse = z.string();

export const zGetUserinfoByOauthResponse = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    picture: z.string()
});

export const zGetPayoutsByPaymentResponse = z.array(zPayoutResponse);

export const zGetIdByPayoutsByPaymentResponse = zPayoutResponse;

export const zPutPlaceholderByTasksResponse = z.object({});

export const zPutUserByUserResponse = z.object({});

export const zGetWalletResponse = zWallet;

export const zPutWalletResponse = zRequestPayoutResponse;

export const zGetChatsByWhatsappResponse = z.array(z.unknown());