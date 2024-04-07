import { api_get, api_post, } from "../apiWithTryCatch";

export const wordOrderApis = {
    getSentenceCategory: () => api_get(process.env.PUBLIC_URL + '/tmpApiData/wordOrderDummy.json'),
    getSentenceData: (category) => {},
    postUserCorrect: () => {},
    postUserSkip: () => {},
}

export const crossWordApis = {
    getCrossWordData: () => {},
    postUserCorrect: () => {},
    postUserSkip: () => {},
}

export const twentyHeadsApis = {
    getTwentyHeadsData: () => {},
    postUserCorrect: () => {},
    postUserSkip: () => {},
}