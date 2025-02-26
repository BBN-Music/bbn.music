import { sumOf } from "@std/collections";
import { zod } from "webgen/zod.ts";

export const DATE_PATTERN = /\d\d\d\d-\d\d-\d\d/;
export const userString = zod.string().min(1).transform((x) => x.trim());

export enum DropType {
    Published = "PUBLISHED", // Uploaded, Approved
    Publishing = "PUBLISHING", // Uploading
    Private = "PRIVATE", // Declined, can be resubmitted
    UnderReview = "UNDER_REVIEW",
    Unsubmitted = "UNSUBMITTED", // Draft
    ReviewDeclined = "REVIEW_DECLINED", // Rejected, cant be resubmitted
    /*
        1: Drafts - Not on Store
            - Draft: Submit (No Fields locked, submitted => Under Review)
            - Under Review (Drafts): Cancel (Reviewers can approve or decline with a reason, declined => Draft with Reason, approved => Publishing, Cancel => Draft)
            - Publishing (Drafts): Take Down Request (Backend is uploading the files and waits for Batch Delivery to complete and sets type to Published, Take Down Request => Takedown Pending)
        2: On Store
            - Revision: Submit (Some fields are locked, Show Changes to Reviewer, submitted => Under Review)
            - Under Review (Revisions): Cancel (Reviewers can approve or decline with a reason, declined => Draft with Reason, approved => Publishing, Cancel => Revision)
            - Publishing (Revisions): Take Down Request (Backend is uploading the files and waits for Batch Delivery to complete and sets type to Published, Take Down Request => Takedown Pending)
            - Published: Take Down Request, Edit (Take Down Request => Takedown Pending, Edit => Revision)
        3: Takendowns
            - Takedown Review: Cancel (Cancel => Published) (On Store Label)
            - Takedown Pending: None (On Store Label)
            - Takedowns: None
        History:
            Save changes in user-events collection along with the already existing action event
    */
}

export enum ArtistTypes {
    Primary = "PRIMARY",
    Featuring = "FEATURING",
    Songwriter = "SONGWRITER",
    Producer = "PRODUCER",
}

export enum ReviewResponse {
    Approved = "APPROVED",
    DeclineCopyright = "DECLINE_COPYRIGHT",
    DeclineMaliciousActivity = "DECLINE_MALICIOUS_ACTIVITY",
}

export const artist = zod.object({
    _id: zod.string(),
    name: userString,
    users: zod.string().array(),
    avatar: zod.string().optional(),
    spotify: zod.string().optional(),
    apple: zod.string().optional(),
});

export const artistref = zod.object({
    _id: zod.string(),
    type: zod.literal(ArtistTypes.Primary).or(zod.literal(ArtistTypes.Featuring)),
}).or(zod.object({
    name: userString,
    type: zod.literal(ArtistTypes.Producer).or(zod.literal(ArtistTypes.Songwriter)),
}));

export const share = zod.object({
    _id: zod.string(),
    drop: zod.string(),
    slug: zod.string(),
    services: zod.record(zod.string()),
});

export const song = zod.object({
    _id: zod.string(),
    user: zod.string().optional(),
    isrc: zod.string().optional(),
    title: userString,
    artists: artistref.array().refine((x) => x.some(({ type }) => type == "PRIMARY"), { message: "At least one primary artist is required" }).refine((x) => x.some(({ type }) => type == "SONGWRITER"), { message: "At least one songwriter is required" }),
    primaryGenre: zod.string(),
    secondaryGenre: zod.string(),
    year: zod.number(),
    //add in frontend with additional info sheet
    country: zod.string().optional(),
    language: zod.string(),
    explicit: zod.boolean(),
    instrumental: zod.boolean(),
    file: zod.string({ required_error: "a Song is missing its file." }),
});

export const pureDrop = zod.object({
    gtin: zod.string()
        .trim()
        .min(12, { message: "UPC/EAN: Invalid length" })
        .max(13, { message: "UPC/EAN: Invalid length" })
        .regex(/^\d+$/, { message: "UPC/EAN: Not a number" })
        .refine((gtin) => parseInt(gtin.slice(-1), 10) === (10 - (sumOf(gtin.slice(0, -1).split("").map((digit, index) => parseInt(digit, 10) * ((16 - gtin.length + index) % 2 === 0 ? 3 : 1)), (x) => x) % 10)) % 10, {
            message: "UPC/EAN: Invalid",
        }).optional(),
    title: userString,
    artists: artistref.array().refine((x) => x.some(({ type }) => type == "PRIMARY"), { message: "At least one primary artist is required" }).refine((x) => x.some(({ type }) => type == "SONGWRITER"), { message: "At least one songwriter is required" }),
    release: zod.string().regex(DATE_PATTERN, { message: "Not a date" }),
    language: zod.string(),
    primaryGenre: zod.string(),
    secondaryGenre: zod.string(),
    compositionCopyright: userString,
    soundRecordingCopyright: userString,
    artwork: zod.string(),
    songs: zod.string().array().min(1),
    comments: userString.optional(),
});

export const drop = pureDrop
    .merge(zod.object({
        _id: zod.string(),
        user: zod.string(),
        type: zod.nativeEnum(DropType),
    }));

const pageOne = zod.object({
    title: userString,
    artists: artistref.array().refine((x) => x.some(({ type }) => type == "PRIMARY"), { message: "At least one primary artist is required" }).refine((x) => x.some(({ type }) => type == "SONGWRITER"), { message: "At least one songwriter is required" }),
    release: zod.string().regex(DATE_PATTERN, { message: "Not a date" }),
    language: zod.string(),
    primaryGenre: zod.string(),
    secondaryGenre: zod.string(),
    gtin: zod.preprocess(
        (x) => x === "" ? undefined : x,
        zod.string().trim()
            .min(12, { message: "UPC/EAN: Invalid length" })
            .max(13, { message: "UPC/EAN: Invalid length" })
            .regex(/^\d+$/, { message: "UPC/EAN: Not a number" })
            .refine((gtin) => parseInt(gtin.slice(-1), 10) === (10 - (sumOf(gtin.slice(0, -1).split("").map((digit, index) => parseInt(digit, 10) * ((16 - gtin.length + index) % 2 === 0 ? 3 : 1)), (x) => x) % 10)) % 10, {
                message: "UPC/EAN: Invalid checksum",
            }).optional(),
    ),
    compositionCopyright: userString,
    soundRecordingCopyright: userString,
});

const pageTwo = zod.object({
    artwork: zod.string(),
    artworkClientData: zod.object({
        type: zod.string().refine((x) => x !== "uploading", { message: "Artwork is still uploading" }),
    }).transform(() => undefined),
});

const pageThree = zod.object({
    songs: song.array().min(1, { message: "At least one song is required" }).refine((songs) => songs.every(({ instrumental, explicit }) => !(instrumental && explicit)), "Can't have an explicit instrumental song"),
    uploadingSongs: zod.array(zod.string()).max(0, { message: "Some uploads are still in progress" }),
});

export const pages = <zod.AnyZodObject[]> [pageOne, pageTwo, pageThree];

export const payout = zod.object({
    _id: zod.string(),
    file: zod.string(),
    period: zod.string(),
    entries: zod.object({
        isrc: zod.string(),
        data: zod.array(
            zod.object({
                store: zod.string(),
                territory: zod.string(),
                quantity: zod.number(),
                revenue: zod.number(),
            }),
        ),
    }).array(),
    user: zod.string(),
});

export const oauthapp = zod.object({
    _id: zod.string(),
    name: userString,
    redirect: zod.string().url().array(),
    secret: zod.string(),
    icon: zod.string(),
});

export const file = zod.object({
    _id: zod.string(),
    length: zod.number(),
    chunkSize: zod.number(),
    uploadDate: zod.string(),
    filename: zod.string(),
    metadata: zod.object({
        type: zod.string(),
    }),
});

export enum PaymentType {
    Restrained = "RESTRAINED", // cannot be withdrawn (when adding funds to account)
    Unrestrained = "UNRESTRAINED", // can be withdrawn
}

export enum AccountType { 
    Default = "DEFAULT",
    Subscribed = "SUBSCRIBED",
    Vip = "VIP",
}

export const wallet = zod.object({
    _id: zod.string(),
    transactions: zod.object({
        amount: zod.number(), // positive for incoming, negative for outgoing
        timestamp: zod.string(),
        type: zod.nativeEnum(PaymentType),
        description: zod.string(),
        counterParty: zod.string(),
    }).array(),
    cut: zod.number(),
    user: zod.string(),
    userName: zod.string().optional(),
    email: zod.string().optional(),
    balance: zod.object({
        restrained: zod.number(),
        unrestrained: zod.number(),
    }).optional(),
    stripeAccountId: zod.string().optional(),
    accountType: zod.nativeEnum(AccountType).default(AccountType.Default),
});

export const bugReport = zod.object({
    type: zod.literal("web-frontend"),
    error: zod.string(),
    errorStack: zod.string(),
    platform: zod.string().optional(),
    platformVersion: zod.string().optional(),
    browserVersion: zod.string().optional(),
    browser: zod.string().optional(),
    userId: zod.string().optional(),
    location: zod.string(),
});

export const transcript = zod.object({
    messages: zod.object({
        author: zod.string(),
        authorid: zod.string(),
        content: zod.string(),
        timestamp: zod.string(),
        avatar: zod.string(),
        attachments: zod.array(zod.string()).optional(),
        embeds: zod.array(zod.any()).optional(),
    }).array(),
    closed: zod.string(),
    with: zod.string(),
    _id: zod.string(),
});

export const requestPayoutResponse = zod.discriminatedUnion("type", [
    zod.object({
        type: zod.literal("createAccount"),
        url: zod.string(),
    }),
    zod.object({
        type: zod.literal("needDetails"),
        missingDetails: zod.array(zod.string()),
        url: zod.string(),
    }),
    zod.object({
        type: zod.literal("success"),
    }),
]);

export enum AuditTypes {
    ResetPassword = "reset-password",
    DropReview = "drop-review",
    DropTypeChange = "drop-type-change",
    DropCreate = "drop-create",
    OAuthValidate = "oauth-validate",
    OAuthAuthorize = "oauth-authorize",
    WebAuthNSignIn = "web-authn-sign-in",
    WebAuthNSignUp = "web-authn-sign-up",
    PasswordSignIn = "password-sign-in",
    PasswordSignUp = "password-sign-up",
    OAuthSignIn = "oauth-sign-in",
    OAuthSignUp = "oauth-sign-up",
}

export const audit = zod.discriminatedUnion("action", [
    zod.object({
        action: zod.literal(AuditTypes.ResetPassword),
    }),
    zod.object({
        action: zod.literal(AuditTypes.DropReview),
        dropId: zod.string(),
    }),
    zod.object({
        action: zod.literal(AuditTypes.DropTypeChange),
        dropId: zod.string(),
        type: zod.nativeEnum(DropType),
    }),
    zod.object({
        action: zod.literal(AuditTypes.DropCreate),
        dropId: zod.string(),
    }),
    zod.object({
        action: zod.literal(AuditTypes.OAuthValidate),
        appId: zod.string(),
        scopes: zod.array(zod.string()),
    }),
    zod.object({
        action: zod.literal(AuditTypes.OAuthAuthorize),
        appId: zod.string(),
        scopes: zod.array(zod.string()),
    }),
    zod.object({
        action: zod.literal(AuditTypes.WebAuthNSignIn),
    }),
    zod.object({
        action: zod.literal(AuditTypes.WebAuthNSignUp),
    }),
    zod.object({
        action: zod.literal(AuditTypes.PasswordSignIn),
    }),
    zod.object({
        action: zod.literal(AuditTypes.PasswordSignUp),
    }),
    zod.object({
        action: zod.literal(AuditTypes.OAuthSignIn),
        provider: zod.string(),
    }),
    zod.object({
        action: zod.literal(AuditTypes.OAuthSignUp),
        provider: zod.string(),
    }),
]);

export enum OAuthScopes {
    Profile = "profile",
    Email = "email",
    Phone = "phone",
}

export const group = zod.object({
    displayName: zod.string(),
    _id: zod.string(), // Replace with id
    permission: zod.string(),
});

export interface Deferred<T> {
    promise: Promise<T>;
    resolve(value?: T | PromiseLike<T>): void;
    // deno-lint-ignore no-explicit-any
    reject(reason?: any): void;
}

export type Group = zod.infer<typeof group>;
export type Audit = zod.infer<typeof audit>;
export type RequestPayoutResponse = zod.infer<typeof requestPayoutResponse>;
export type ArtistRef = zod.infer<typeof artistref>;
export type Artist = zod.infer<typeof artist>;
export type BugReport = zod.infer<typeof bugReport>;
export type Drop = zod.infer<typeof drop>;
export type File = zod.infer<typeof file>;
export type OAuthApp = zod.infer<typeof oauthapp>;
export type Payout = zod.infer<typeof payout>;
export type Song = zod.infer<typeof song>;
export type Transcript = zod.infer<typeof transcript>;
export type Wallet = zod.infer<typeof wallet>;
export type Share = zod.infer<typeof share>;
