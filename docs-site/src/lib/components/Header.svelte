<script lang="ts">
	import { base } from '$app/paths';
	import { L } from '../../i18n/i18n-svelte';
</script>

<header class="border-b border-gray-100 dark:border-gray-800">
	<div class="container mx-auto px-4 py-4 flex justify-between items-center">
		<a href="{base}/" class="text-xl font-medium tracking-tight hover:text-primary-500 transition-colors">
			{$L.general.title()}
		</a>
		<nav>
			<ul class="flex gap-6">
				<li>
					<a
						href="{base}/installation"
						class="text-sm font-medium hover:text-primary-500 transition-colors"
						>{$L.nav.installation()}</a
					>
				</li>
				<li>
					<a
						href="{base}/configuration"
						class="text-sm font-medium hover:text-primary-500 transition-colors"
						>{$L.nav.configuration()}</a
					>
				</li>
				<li>
					<a
						href="{base}/usage"
						class="text-sm font-medium hover:text-primary-500 transition-colors"
						>{$L.nav.usage()}</a
					>
				</li>
			</ul>
		</nav>
	</div>
</header>