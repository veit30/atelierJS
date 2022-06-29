<script lang="ts" context="module">
	import type { Load } from './__types/signin.d';

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
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';
	import { useForm, Hint } from '@svuick/form';
	const form = useForm();

	let email: string = 'test@davidplugge.de';
	let password: string = 'testuser';

	async function handleSubmit() {
		const redirect = $page.url.searchParams.get('redirectTo') ?? '/';
		const { error } = await supabase.auth.signIn({ email, password });
		if (error) console.log(error);
		goto(redirect);
	}
</script>

<div class="max-w-xl mx-auto">
	<form use:form on:submit|preventDefault={handleSubmit} class="px-8 pt-6 pb-8 mb-4">
		<h1 class="mb-8 text-2xl">Sign In</h1>

		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="email">E-Mail</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="email"
				name="email"
				type="email"
				placeholder="example@domain.com"
				required
				bind:value={email}
			/>
			<Hint for="email">
				<span slot="required" class="error">Please enter your email</span>
				<span slot="type" class="error">Invalid email</span>
			</Hint>
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
			<Hint for="email">
				<span slot="required" class="error">Please enter your password</span>
			</Hint>
		</div>

		<div class="flex items-center justify-between">
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				type="submit"
			>
				Sign In
			</button>
			<div class="flex flex-col items-end">
				<a
					class="block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					href="/reset-password"
				>
					Forgot Password?
				</a>
				<a
					class="block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					href="/signup"
				>
					Dont have an account?
				</a>
			</div>
		</div>
	</form>
</div>
