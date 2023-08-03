import { download as native_download } from 'tauri-plugin-upload-api'
import { tempdir } from '@tauri-apps/api/os'
import { runPS } from './psRunner'

export const download = async (url: string, fileName: string, updateCallback: (progress: number, maxProgress: number) => void): Promise<void> => {
    await native_download(url, `${await tempdir()}\\${fileName}.Msixbundle`, updateCallback)
}

export const mergeFiles = async (file1: string, file2: string, savePath: string): Promise<boolean> => {
    console.log(file1)
    console.log(file1)
    console.log(savePath)

    const psScript: string = `cmd.exe /C COPY /B ${file1} + ${file2} ${savePath}`
    runPS(psScript, (output: string) => {})

    return true
}