<script lang="ts">
	import { session } from '$app/stores';
	import { supabase } from '$lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';
</script>

<SupaAuthHelper supabaseClient={supabase} {session}>
	<slot />
</SupaAuthHelper>
