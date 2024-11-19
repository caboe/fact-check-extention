import forms from '@tailwindcss/forms';
import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./public/**/*.html',
		// 3. Append the path to the Skeleton package
		join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}',
			'./public/**/*.html'
		)
	],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		skeleton({
			themes: { preset: ['seafoam'] }
		})
	],
	safelist: [
		'slide-toggle',
		'inline-block',
		'bg-white',
		'rounded-full',
		'hover:brightness-[105%]',
		'dark:hover:brightness-110',
		'cursor-pointer',
		'slide-toggle-label',
		'unstyled',
		'flex',
		'items-center',
		'slide-toggle-label',
		'slide-toggle-track',
		'transition-all',
		'duration-[200ms]',
		'w-16',
		'h-8',
		'bg-surface-900',
		'dark:bg-surface-300',
		'bg-surface-400',
		'dark:bg-surface-700',
		'slide-toggle-thumb',
		'w-[50%]',
		'h-full',
		'scale-[0.8]',
		'shadow',
		'bg-white/75',
		'translate-x-full',
		'hidden'
		// 'grid',
		// 'grid-cols-[16px_1fr]'
	]
} satisfies Config;

export default config;
