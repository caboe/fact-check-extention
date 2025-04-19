<script lang="ts">
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
</script>

<div class="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
	<Header />
	<main class="container mx-auto flex-grow px-4 py-8">
		<slot />
	</main>
	<Footer />
</div>
