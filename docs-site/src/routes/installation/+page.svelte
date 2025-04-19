<script lang="ts">
	import { L } from '../../i18n/i18n-svelte';
</script>

<div class="prose max-w-none">
	<h1 class="h1">{$L.installation.title()}</h1>

	<section class="mb-12">
		<h2 class="h2">{$L.installation.web_store_heading()}</h2>
		<p>{$L.installation.web_store_intro()}</p>
		<a
			href="https://chromewebstore.google.com/detail/fact-checker-gpt-connecto/jikiecjhdofccpaejidggiiiejogemni"
			class="btn btn-primary mt-4"
		>
			{$L.installation.web_store_link_text()}
		</a>
	</section>

	<section class="mb-12">
		<h2 class="h2">{$L.installation.developer_mode_heading()}</h2>
		<p>{$L.installation.developer_mode_intro()}</p>

		<div class="bg-base-200 mt-4 rounded-lg p-6">
			<ol class="list-decimal space-y-4 pl-6">
				<li>{$L.installation.developer_mode_steps.step1()}</li>
				<li>
					{$L.installation.developer_mode_steps.step2({
						command: 'bun run build',
						zipFile: 'fact-check-extension.zip'
					})}
				</li>
				<li>{$L.installation.developer_mode_steps.step3()}</li>
				<li>{$L.installation.developer_mode_steps.step4()}</li>
				<li>{$L.installation.developer_mode_steps.step5()}</li>
				<li>{$L.installation.developer_mode_steps.step6()}</li>
				<li>{$L.installation.developer_mode_steps.step7()}</li>
			</ol>
		</div>
	</section>
</div>
