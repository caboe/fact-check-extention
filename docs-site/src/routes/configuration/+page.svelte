<script lang="ts">
	import { L } from '../../i18n/i18n-svelte';
	import { CodeBlock } from '@skeletonlabs/skeleton';
</script>

<div class="prose max-w-none">
	<h1 class="h1">{$L.configuration.title()}</h1>

	<section class="mb-12">
		<h2 class="h2">{$L.configuration.endpoints_heading()}</h2>
		<p>{$L.configuration.endpoints_intro()}</p>

		<div class="bg-base-200 mt-4 rounded-lg p-6">
			<ol class="list-decimal space-y-4 pl-6">
				<li>{$L.configuration.endpoints_steps.step1()}</li>
				<li>{$L.configuration.endpoints_steps.step2()}</li>
				<li>{$L.configuration.endpoints_steps.step3()}</li>
				<li>{$L.configuration.endpoints_steps.step4()}</li>
				<li>{$L.configuration.endpoints_steps.step5()}</li>
				<li>{$L.configuration.endpoints_steps.step6()}</li>
			</ol>

			<CodeBlock language="typescript" class="mt-6">
				{`// Beispiel-Endpoint-Konfiguration
{
  "title": "Gemini API",
  "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  "apiKey": "YOUR_API_KEY"
}`}
			</CodeBlock>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="h2">{$L.configuration.ollama_heading()}</h2>
		<p>{$L.configuration.ollama_intro()}</p>

		<div class="bg-base-200 mt-4 rounded-lg p-6">
			<ol class="list-decimal space-y-4 pl-6">
				<li>{$L.configuration.ollama_steps.step1()}</li>
				<li>{$L.configuration.ollama_steps.step2()}</li>
				<li>
					{$L.configuration.ollama_steps.step3({
						ollamaUrl: 'http://localhost:11434'
					})}
				</li>
				<li>{$L.configuration.ollama_steps.step4()}</li>
				<li>{$L.configuration.ollama_steps.step5()}</li>
			</ol>
		</div>
	</section>
</div>
