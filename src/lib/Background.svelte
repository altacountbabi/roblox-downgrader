<div class=background_wrapper>
	<div class=background />
</div>

<style>
    :root {
        --background-color: #151515;
        --grid-color: #222;
        --grid-size: 25px;
    }

	.background_wrapper {
		position: absolute;
		z-index: -1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 15px;
	}

	.background {
		background-color: var(--background-color);
		background-image: linear-gradient(
				to right,
				var(--grid-color) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				var(--grid-color) 1px,
				transparent 1px
			);
		background-size: var(--grid-size) var(--grid-size);
		width: 100vw;
		height: 100vh;
		animation: grid-animation 2s linear infinite;
	}

	@keyframes grid-animation {
		0% {
			background-position: 0 5px;
		}
		100% {
			background-position: var(--grid-size) 5px;
		}
	}
</style>