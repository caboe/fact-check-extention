<script lang="ts">
	import { base } from '$app/paths';
	import { L } from '../i18n/i18n-svelte';
</script>

<svelte:head>
	<title>{$L.general.title()}</title>
</svelte:head>

<section class="flex flex-col items-center py-16 text-center md:py-24">
	<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
		{$L.home.welcome({ name: 'Fact Check Extension' })}
	</h1>
	<p class="mb-10 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
		{$L.home.introduction()}
	</p>
	<div class="mt-6 flex flex-col gap-4 sm:flex-row">
		<a href="{base}/installation" class="btn btn-primary rounded-md px-6 py-3"
			>{$L.nav.installation()}</a
		>
		<a
			href="{base}/configuration"
			class="btn rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
			>{$L.nav.configuration()}</a
		>
	</div>
</section>

<section class="mt-16 md:mt-24">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		<!-- Removed card class, using padding and border directly for minimalism -->
		<div class="rounded-lg border border-gray-100 p-6 dark:border-gray-800">
			<h3 class="mb-3 text-xl font-medium">{$L.nav.installation()}</h3>
			<p class="mb-4 text-gray-500 dark:text-gray-400">
				Learn how to install the Fact Check Extension from the Chrome Web Store or in developer
				mode.
			</p>
			<a href="{base}/installation" class="text-primary-600 dark:text-primary-400 hover:underline"
				>Get started →</a
			>
		</div>
		<div class="rounded-lg border border-gray-100 p-6 dark:border-gray-800">
			<h3 class="mb-3 text-xl font-medium">{$L.nav.configuration()}</h3>
			<p class="mb-4 text-gray-500 dark:text-gray-400">
				Configure API endpoints, obtain API keys, and set up local Ollama instances.
			</p>
			<a href="{base}/configuration" class="text-primary-600 dark:text-primary-400 hover:underline"
				>Configure →</a
			>
		</div>
		<div class="rounded-lg border border-gray-100 p-6 dark:border-gray-800">
			<h3 class="mb-3 text-xl font-medium">{$L.nav.usage()}</h3>
			<p class="mb-4 text-gray-500 dark:text-gray-400">
				Learn how to select text and images for fact-checking and use the extension effectively.
			</p>
			<a href="{base}/usage" class="text-primary-600 dark:text-primary-400 hover:underline"
				>Learn more →</a
			>
		</div>
	</div>
</section>
