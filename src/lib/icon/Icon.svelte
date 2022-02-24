<script lang="ts">
	import type { ICON } from './IconName';

	export let name: ICON;
	export let size = '24px';
</script>

<svg class={$$restProps.class ?? '' + ' min-w-max'} width={size} height={size}>
	<use href="#{name}" width={size} height={size} />
</svg>
