<script lang="ts">
	type GlobalVarType = number | string;
	interface GlobalVar {
		name: string;
		type: 'number' | 'string';
		value: GlobalVarType;
	}

	let newType: GlobalVar['type'];
	export let items: GlobalVar[] = [];

	function getInputValue(e) {
		return e.target.value;
	}

	function handleAddItem() {
		items = [...items, { name: 'NewVar', type: newType, value: 0 }];
	}
</script>

<div class="flex flex-col gap-2 p-2">
	<div class="flex w-max gap-2">
		<select bind:value={newType} class="bg-[#1e1e1e] w-full cursor-pointer">
			<option value="number">Number</option>
			<option value="string">String</option>
		</select>
		<button on:click={handleAddItem} class="bg-green-700 hover:bg-green-800 px-2 py-1">add</button>
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
					<input
						class="bg-transparent w-full"
						type={item.type}
						value={item.value}
						on:input={(e) => (item.value = getInputValue(e))}
					/>
				</td>
			</tr>
		{/each}
	</table>
</div>
