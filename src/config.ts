import {indexConfigInfo} from "./types";

export const mainSite = import.meta.env.VITE_MAIN_SITE;

export const indicesConfiguration: indexConfigInfo[] = Object.keys(import.meta.env).filter(
  x => x.startsWith("VITE_INDEX_CONFIGURATION_")
).map(
  (y) => {
    const indexString = import.meta.env[y]?.split(",");

    if (indexString === undefined)
      return undefined;

    return {
      name: indexString[0],
      mainSite: indexString[2],
      apiUrl: indexString[1],
      indexName: indexString[3],
      indexIsGallery: (indexString[4] === "true"),
    };

  }
).filter((item): item is indexConfigInfo => !!item);