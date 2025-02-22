
## Developing

Once you've created a project and installed dependencies with `bun install` start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run release
```

## Using the Chrome Extension

1. Build the extension:
   ```bash
   bun run release
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the `dist` directory from this project

5. The extension will appear in your extensions list and can be pinned to the toolbar

6. Click the extension icon to open the popup and start using the fact-checking features

Note: The extension requires an internet connection to verify facts against external APIs.


## License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
