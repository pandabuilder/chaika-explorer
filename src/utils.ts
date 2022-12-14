import {indexConfigInfo, Tag} from "./types";
import {indicesConfiguration} from "./config";

export function fileSizeIEC(bytes: number) {
    const exp = Math.log(bytes) / Math.log(1024) | 0;
    const result = (bytes / (1024 ** exp)).toFixed(2);

    return `${result} ${(exp === 0 ? 'bytes' : `${'KMGTPEZY'[exp - 1]}B`)}`;
}
// KiB,MiB,GiB,TiB,PiB,EiB,ZiB,YiB

const scopePriorities = ['language', 'artist', 'group', 'parody', 'character', 'female', 'male', 'mixed', 'other', 'misc'];

export function sortTagsObject(tagList: Tag[]) {
    const prioritizedTaglist = [];

    scopePriorities.forEach((x) => {
        const matchedTags = tagList.filter(y => y.scope === x).sort();
        if (matchedTags.length > 0) {
            prioritizedTaglist.push(matchedTags);
        }
    });
    const remainingTags = tagList.filter(y => !scopePriorities.includes(y.scope)).sort();
    if (remainingTags.length > 0) {
        prioritizedTaglist.push(remainingTags);
    }

    return prioritizedTaglist;
}

export function updateSearchParam(paramName: string, paramValue: string) {
    const base = window.location.href.split('?')[0];
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, paramValue);
    const paramsSting = params.toString() ? `?${params.toString()}` : '';
    const newURL = `${base}${paramsSting}`;
    window.history.pushState({ path: newURL }, '', newURL);
}

const getQuery = () => {
    if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
};

export const getQueryStringVal = (key: string): string | null => {
    return getQuery().get(key);
};

export const getCurrentIndex = (): indexConfigInfo => {
    const index = getQueryStringVal('index');
    const indexParams = indicesConfiguration.find(x => x.name === index);

    return indexParams ? indexParams : indicesConfiguration[0];
};
