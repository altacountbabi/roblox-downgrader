<script lang='ts'>
	import { onMount } from 'svelte'
	import { tempdir } from '@tauri-apps/api/os'
	import { invoke } from '@tauri-apps/api'
	import { fly } from 'svelte/transition'
	import Background from './lib/Background.svelte'
	import Progressbar from './lib/Progressbar.svelte'
	import { download, mergeFiles } from './lib/downloader'
	import { fetchLatestData, type LatestData } from './lib/dataFetcher'
	import { runPS } from './lib/psRunner'

	let showProgressbar: boolean = false
	let startedDowngrading: boolean = false
	let progressBarProgress: number = 0
	let robloxInstalled: boolean = true
	let robloxVersion: number = 0
	let latestData: LatestData

	let downgradeStatus: string = 'Checking stuff'

	const downgrade = async () => {
		const temp = await tempdir()
		startedDowngrading = true
		await runPS('Get-AppxPackage | Where-Object { $_.Name -like \'*ROBLOXCORPORATION.ROBLOX*\' }', output => {
			if (output == '') {
				robloxInstalled = false
			}
		})

		if (robloxInstalled) await runPS("(Get-AppxPackage | Where-Object { $_.Name -like '*ROBLOXCORPORATION.ROBLOX*' }).Version", (output: string) => robloxVersion = parseInt(output.split('.')[1]))

		if (robloxInstalled && robloxVersion == latestData.latestBundleVersion) {
			showProgressbar = false
			downgradeStatus = "You are already on a downgraded version, if you believe this is wrong please contact me on discord at @whoman0385"
			return
		}

		showProgressbar = true
		downgradeStatus = 'Downloading chunk 1'
		await download(latestData.latestBundleUrls.chunk0, "robloxDowngrader_chunk0", () => progressBarProgress += 1)
		downgradeStatus = 'Downloading chunk 2'
		progressBarProgress = 0
		await download(latestData.latestBundleUrls.chunk1, "robloxDowngrader_chunk1", () => progressBarProgress += 1)
		showProgressbar = false
		downgradeStatus = 'Merging chunks'
		progressBarProgress = 0
		await mergeFiles(`${temp}\\robloxDowngrader_chunk0.Msixbundle`, `${temp}\\robloxDowngrader_chunk1.Msixbundle`, `${temp}\\robloxDowngrader_${latestData.latestBundleVersion}.Msixbundle`)

		setTimeout(async () => {
			await invoke('remove_file', { filePath: `${temp}\\robloxDowngrader_chunk0.Msixbundle` })
			await invoke('remove_file', { filePath: `${temp}\\robloxDowngrader_chunk1.Msixbundle` })

			downgradeStatus = "Downgrading"

			await runPS(`Add-Appxpackage -ForceUpdateFromAnyVersion -Path "${temp}\\robloxDowngrader_${latestData.latestBundleVersion}.Msixbundle"`, (output: string) => {})
			await runPS("(Get-AppxPackage | Where-Object { $_.Name -like '*ROBLOXCORPORATION.ROBLOX*' }).Version", (output: string) => robloxVersion = parseInt(output.split('.')[1]))

			if (robloxVersion == latestData.latestBundleVersion) {
				downgradeStatus = 'Successfully downgraded roblox.\n\n\nIf you see a button saying "Retry" when you open roblox, spam it until it\'s gone'
				await invoke('remove_file', { filePath: `${temp}\\robloxDowngrader_${latestData.latestBundleVersion}.Msixbundle` })
			} else {
				downgradeStatus = `Possible failure in downgrading, please check your roblox version and see if its ${latestData.latestBundleVersion}`
			}
		}, 2000)
	}

	onMount(async () => {
		latestData = await fetchLatestData()

		document.addEventListener('contextmenu', event => event.preventDefault())
		document.addEventListener('keydown', event => event.preventDefault())
	})
</script>

<Background/>
<div class=main>
    {#if startedDowngrading}
		<div class=content transition:fly={{ duration: 750, y: 100, delay: 350 }}>
			<span>{downgradeStatus}</span>
			{#if showProgressbar}
				<Progressbar currentProgress={progressBarProgress} maxProgress={146}/> 
			{/if}
		</div>
	{:else}
		<div class=content transition:fly={{ duration: 500, y: 100 }}>
			<button class=downgrade_button on:click={downgrade}>
				Start downgrading
			</button>
		</div>
	{/if}
</div>

<style>
    .main {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	.downgrade_button {
		background: #272727;
		border: 1px solid #272727;
		border-radius: 5px;
		padding: 15px;
		color: #ddd;
		font-weight: 600;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		line-height: 1.1em;
		cursor: pointer;
		transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
		
		&:hover {
			background: #2a2a2a;
			border: 1px solid #333;
		}
	}

	.content {
		position: absolute;
	}

	.content > span {
		color: #ddd;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-weight: 600;
		text-align: center;
		width: 200px;
		margin-bottom: 15px;
		display: block;
	}
</style>