I have completed the implementation of the LightRAG integration.

### Completed Tasks
1.  **State Management**:
    -   Created `src/lib/state/ragEndpoints.svelte.ts` to manage RAG endpoint configurations.
    -   Updated `unifiedStorage` to persist selected RAG endpoints.
    -   Updated `apiRequest` to include a `FETCHING_RAG` state.
    -   Updated `popupState` to handle the new RAG configuration view.

2.  **UI Components**:
    -   Created `RagConfig.svelte`, `RagEndpointList.svelte`, and `EditRagEndpointForm.svelte` for managing RAG endpoints.
    -   Integrated these components into the `Popup.svelte`.
    -   Updated `Connection.svelte` to allow users to select multiple RAG endpoints and access the configuration.
    -   Updated `Response.svelte` to display "Fetching RAG Data..." when the RAG process is active.

3.  **Logic Implementation**:
    -   Updated `checkFact.svelte.ts` to fetch data from selected RAG endpoints before calling the LLM.
    -   The RAG data (entities, relationships, chunks) is formatted and appended to the user prompt context.

4.  **Localization**:
    -   Added all necessary translation keys to `src/i18n/en/index.ts`.
    -   Regenerated i18n types to ensure type safety.

The extension now supports configuring and querying multiple LightRAG endpoints, enriching the fact-checking process with structured knowledge graph data.