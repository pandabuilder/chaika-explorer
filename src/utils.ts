interface Tag {
    name: string;
    scope: string;
    full: string;
}

export function fileSizeIEC(bytes: number) {
    const exp = Math.log(bytes) / Math.log(1024) | 0;
    const result = (bytes / (1024 ** exp)).toFixed(2);

    return `${result} ${(exp === 0 ? 'bytes' : `${'KMGTPEZY'[exp - 1]}B`)}`;
}
// KiB,MiB,GiB,TiB,PiB,EiB,ZiB,YiB

const scopePriorities = ['language', 'artist', 'group', 'parody', 'character', 'female', 'male', 'misc'];

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