// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import bbnMusicLogo from "../assets/img/bbnMusic.svg";
// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import bbnAdminLogo from "../assets/img/bbnAdmin.svg";
// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import bbnWalletLogo from "../assets/img/bbnWallet.svg";

import { Permission } from "../spec/mod.ts";

export type NavigationType = "Home" | "Music" | "Settings" | "Admin" | "Wallet";

// 0: no login required, 1: show only when logged in, 2: show only when logged out
export const pages: [logo: string, perm: Array<Permission>, route: string, login: 0 | 1 | 2][] = [
    [bbnMusicLogo, [], "/c/music", 0],
    [bbnWalletLogo, [], "/wallet", 1],
    [bbnAdminLogo, ["/bbn/manage", "/hmsys/user"], "/admin", 1],
];

// Move this to the up array when we use the hmsys permission system
export const loginRequired = [
    "/c/music",
    "/admin",
    "/oauth",
    "/wallet",
    "/settings",
];

export function activeLogo(type: NavigationType) {
    if (type == "Music") {
        return bbnMusicLogo;
    }
    if (type == "Wallet") {
        return bbnWalletLogo;
    }
    if (type == "Admin") {
        return bbnAdminLogo;
    }
    return bbnMusicLogo;
}

export function activeTitle(type: NavigationType) {
    if (type == "Music") {
        return "BBN Music";
    }
    if (type == "Wallet") {
        return "BBN Wallet";
    }
    if (type == "Admin") {
        return "BBN Admin";
    }
    return "BBN Music";
}
