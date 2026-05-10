import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ignorePatterns = [
	'node_modules',
	'dist-',
	'.git',
	'.gitignore',
	'.DS_Store',
	'*.lock',
	'package-lock.json',
	'bun.lockb',
	'source-firefox',
	'README.FIREFOX.md',
	'eslint.config.js',
	'prettier',
	'playwright.config.ts',
	'WEB_STORE.md',
	'.trae',
	'doc',
	'images',
	'www',
	'.npmrc',
	'.typesafe-i18n.json',
]

function shouldIgnore(filePath) {
	const normalizedPath = filePath.replace(/\\/g, '/')
	return ignorePatterns.some((pattern) => {
		if (pattern.endsWith('/')) {
			return normalizedPath.includes(pattern)
		} else if (pattern.includes('*')) {
			const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
			return regex.test(path.basename(normalizedPath)) || regex.test(normalizedPath)
		}
		return normalizedPath === pattern || normalizedPath.endsWith(pattern)
	})
}

const readmeContent = `# Firefox Extension Source Code Submission

## Build Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0 or bun >= 1.0.0
- Operating System: macOS, Windows, or Linux

### Build Steps

1. Install dependencies:
   \`\`\`bash
   npm install
   # or
   bun install
   \`\`\`

2. Build the Firefox extension:
   \`\`\`bash
   bun run build:firefox
   \`\`\`

   This creates the extension in the \`dist-firefox/\` directory.

3. The built extension files are in \`dist-firefox/\`.

## Source Code Structure

- \`src/\` - Source TypeScript/Svelte files
- \`public/\` - Static assets and manifest files
- \`vite.config.ts\` - Build configuration
- \`vite.scripts.config.ts\` - Script build configuration
- \`package.json\` - Project dependencies and scripts
`

const readmeFile = 'README.FIREFOX.md'
const zipFile = `source-firefox-${new Date().toISOString().split('T')[0]}.zip`

fs.writeFileSync(readmeFile, readmeContent)

try {
	const gitOutput = execSync('git ls-files', { cwd: process.cwd() })
	const allFiles = gitOutput
		.toString()
		.trim()
		.split('\n')
		.filter((f) => f && !shouldIgnore(f))

	const sourceFiles = allFiles.filter(
		(f) =>
			f.startsWith('src/') ||
			f.startsWith('public/') ||
			f.includes('config') ||
			f.includes('package') ||
			f.includes('tsconfig') ||
			f.includes('tailwind') ||
			f.includes('postcss') ||
			f.includes('svelte') ||
			f.includes('vite') ||
			f.startsWith('tests/') ||
			f === 'index.html',
	)

	sourceFiles.push(readmeFile)

	const filesToZip = sourceFiles.join(' ')
	console.log(`Creating ${zipFile} with ${sourceFiles.length} files...`)

	execSync(`zip -r ${zipFile} ${filesToZip}`, { stdio: 'inherit' })

	console.log(`Created ${zipFile}`)
} finally {
	if (fs.existsSync(readmeFile)) {
		fs.unlinkSync(readmeFile)
	}
}
