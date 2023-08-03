import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'

export const runPS = async (script: string, outputCallback: (output: string) => void) => {
    const unlisten = await listen<string>('ps_output', (event) => {
        outputCallback(event.payload)
    })

    await invoke('run_ps', {
        code: script
    })
}