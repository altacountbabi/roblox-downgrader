import axios from 'axios'

export type LatestData = {
    latestBundleUrls: {
        chunk0: string,
        chunk1: string
    },
    latestBundleVersion: number
}

export const fetchLatestData = async (): Promise<LatestData> => {
    const latestData = 'https://raw.githubusercontent.com/altacountbabi/roblox-downgrader/main/latest%20data.json'
    return (await axios.get(latestData)).data
}
