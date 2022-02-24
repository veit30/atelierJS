<script lang="ts">
	import Icon, { ICON } from '$lib/icon';

	export let extension: string = '';
</script>

{#if extension === '.js'}
	<Icon name={ICON.JS} size="12px" />
{:else if extension === '.ts'}
	<Icon name={ICON.TS} size="12px" />
{:else if extension === '.json'}
	<Icon name={ICON.JSON} size="12px" />
{:else}
	<Icon name={ICON.FILE} size="12px" />
{/if}
