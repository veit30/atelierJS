<script lang="ts">
	type GlobalVar = { name: string } & (
		| { type: 'number'; value: number }
		| { type: 'string'; value: string }
		| { type: 'boolean'; value: boolean }
	);

	export let items: GlobalVar[] = [];

	function handleAddItem(type: GlobalVar['type'], value: GlobalVar['value']) {
		items = [...items, { name: 'NewVar', type, value }] as GlobalVar[];
	}
</script>

<div class="flex flex-col gap-2 p-2">
	<div class="flex w-max gap-2">
		<button on:click={() => handleAddItem('number', 0)}>Number</button>
		<button on:click={() => handleAddItem('string', '')}>String</button>
		<button on:click={() => handleAddItem('boolean', false)}>Boolean</button>
	</div>
	<table class="text-left">
		<tr>
			<th class="p-1">Name</th>
			<th class="p-1">Value</th>
		</tr>
		{#each items as item}
			<tr>
				<td class="p-1">
					<input type="text" bind:value={item.name} class="bg-transparent w-full" />
				</td>
				<td class="p-1">
					{#if item.type === 'number'}
						<input class="bg-transparent w-full" type="number" bind:value={item.value} />
					{:else if item.type === 'string'}
						<input class="bg-transparent w-full" type="text" bind:value={item.value} />
					{:else if item.type === 'boolean'}
						<input class="bg-transparent w-full" type="checkbox" bind:checked={item.value} />
					{/if}
				</td>
			</tr>
		{/each}
	</table>
</div>
