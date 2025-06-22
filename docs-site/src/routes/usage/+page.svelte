<script lang="ts">
	import { L } from '../../i18n/i18n-svelte';
</script>

<div class="max-w-none">
	<h1 class="h1">{$L.usage.title()}</h1>

	<section class="mb-12">
		<h2 class="h2">{$L.usage.select_text_heading()}</h2>
		<p>{$L.usage.select_text_intro()}</p>
		<div class="bg-base-200 mt-4 rounded-lg p-4">
			<img
				src="/images/text-selection-demo.gif"
				alt="Demonstration of selecting text for fact checking"
				class="rounded border"
			/>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="h2">{$L.usage.select_image_heading()}</h2>
		<p>{$L.usage.select_image_intro()}</p>
		<div class="bg-base-200 mt-4 rounded-lg p-4">
			<img
				src="/images/image-selection-demo.gif"
				alt="Demonstration of right-clicking an image to fact check it"
				class="rounded border"
			/>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="h2">{$L.usage.select_ui_heading()}</h2>
		<p>{$L.usage.select_ui_intro()}</p>
		<div class="bg-base-200 mt-4 flex gap-4 rounded-lg p-4">
			<div class="flex-1">
				<h3 class="h3">Text Input</h3>
				<textarea class="textarea textarea-bordered w-full" placeholder="Enter text manually"
				></textarea>
			</div>
			<div class="flex-1">
				<h3 class="h3">Image Upload</h3>
				<input type="file" class="file-input file-input-bordered w-full" accept="image/*" />
			</div>
		</div>
	</section>
</div>
