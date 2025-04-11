import forms from '@tailwindcss/forms'
import { join } from 'path'
import type { Config } from 'tailwindcss'

import { skeleton } from '@skeletonlabs/tw-plugin'

const config = {
	darkMode: 'class', // Enable class-based dark mode
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./public/**/*.html',
		join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}',
			'./public/**/*.html',
		),
	],
	theme: {
		extend: {},
	},
	plugins: [
		forms,
		skeleton({
			themes: { preset: ['rocket'] }, // Add vintage theme for dark mode
		}),
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
		'hidden',
	],
} satisfies Config

export default config
