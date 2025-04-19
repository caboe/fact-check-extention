<script lang="ts">
	import { base } from '$app/paths';
</script>

<footer class="mt-auto border-t border-gray-100 dark:border-gray-800">
	<div class="container mx-auto px-4 py-6">
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<div class="text-sm text-gray-500 dark:text-gray-400">
				© {new Date().getFullYear()} Fact Check Extension
			</div>
			<div class="flex gap-6">
				<a
					href="{base}/"
					class="hover:text-primary-500 text-xs text-gray-500 transition-colors dark:text-gray-400"
					>Home</a
				>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-primary-500 text-xs text-gray-500 transition-colors dark:text-gray-400"
					>GitHub</a
				>
				<a
					href="#"
					class="hover:text-primary-500 text-xs text-gray-500 transition-colors dark:text-gray-400"
					>Privacy Policy</a
				>
			</div>
		</div>
	</div>
</footer>
