<script lang=ts>
	import { onMount, afterUpdate } from 'svelte'

	export let maxProgress: number
	export let currentProgress: number

	let progressWidth = 0

	const calculateProgress = () => Math.min(Math.max((currentProgress / maxProgress) * 100, 0), 100)
    const updateProgressWidth = () => progressWidth = calculateProgress()
	onMount(updateProgressWidth)
	afterUpdate(updateProgressWidth)
</script>

<div class=bar>
	<div style="width: {progressWidth}%" />
</div>

<style>
	.bar {
		width: 200px;
		border-radius: 5px;
		height: 15px;
		background: #222;
		position: relative;
	}

	.bar div {
		height: 15px;
		background: #333;
		border-radius: 5px;
	}
</style>