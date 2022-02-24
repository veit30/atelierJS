<script lang="ts">
	let show = false;
	let x, y;
	let event: Event;

	const CLOSE_EVENTS = ['click', 'contextmenu', 'mousedown', 'blur'];

	function handleClose(e: Event) {
		if (event === e) return;
		show = false;
		CLOSE_EVENTS.forEach((e) => window.removeEventListener(e, handleClose));
	}

	function handleOpen(e: MouseEvent) {
		e.preventDefault();
		event = e;
		x = e.clientX;
		y = e.clientY;
		show = true;

		CLOSE_EVENTS.forEach((e) =>
			window.addEventListener(e, handleClose, { passive: true, capture: false })
		);
	}
</script>

{#if show}
	<div style="top: {y}px; left: {x}px;" on:mousedown|stopPropagation>
		<slot name="contextmenu" />
	</div>
{/if}
<slot open={handleOpen} />

<style>
	div {
		position: absolute;
		z-index: 10;
	}
</style>
