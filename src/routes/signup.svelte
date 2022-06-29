<script lang="ts" context="module">
	import type { Load } from './__types/signup.d';

	export const load: Load = async ({ session }) => {
		if (!session.user)
			return {
				status: 302,
				redirect: `/`
			};
		return {};
	};
</script>

<script lang="ts">
	import { supabase } from '$lib/db';
	import { useForm, Hint } from '@svuick/form';
	const form = useForm();

	let username: string = 'Testuser';
	let email: string = 'test@davidplugge.de';
	let password: string = 'testuser';

	async function handleSubmit() {
		const { error } = await supabase.auth.signUp({ email, password });
		if (error) console.log(error);
	}
</script>

<div class="max-w-xl mx-auto">
	<form use:form on:submit|preventDefault={handleSubmit} class="px-8 pt-6 pb-8 mb-4">
		<h1 class="mb-8 text-2xl">Sign Up</h1>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="username"
				name="username"
				type="text"
				placeholder="Username"
				required
				bind:value={username}
			/>
		</div>

		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="emi">E-Mail</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="email"
				name="email"
				type="text"
				placeholder="your@email.com"
				required
				bind:value={email}
			/>
		</div>

		<div class="mb-6">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="password"
				name="password"
				type="password"
				placeholder="******************"
				required
				bind:value={password}
			/>
		</div>

		<div class="flex items-center justify-between">
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				type="submit"
			>
				Sign Up
			</button>
			<a
				class="block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
				href="/signin"
			>
				Already have an account?
			</a>
		</div>
	</form>
</div>
