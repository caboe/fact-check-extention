I will implement the LightRAG integration by creating a new configuration section for RAG endpoints, adding a selection UI in the connection step, and updating the fact-checking logic to fetch and include RAG data.

### 1. State Management
- **Create `src/lib/state/ragEndpoints.svelte.ts`**:
  - Define `RagEndpoint` interface with fields: `title`, `url`, `apiKey`, `mode`, `top_k`.
  - Implement `RagEndpoints` class extending `PersistState` to manage the list of RAG endpoints.
- **Update `src/lib/util/unifiedStorage.svelte.ts`**:
  - Add `selectedRagEndpoints: string[]` to `IUnifiedState` to store selected endpoint titles.
- **Update `src/lib/state/apiRequest.svelte.ts`**:
  - Add `'FETCHING_RAG'` to `ApiRequestState` type.
- **Update `src/popupState.svelte.ts`**:
  - Add `'RAG_CONFIG'` to the allowed states.

### 2. Localization
- **Update `src/i18n/en/index.ts`**:
  - Add new translation keys for RAG UI (e.g., `ragConfiguration`, `ragEndpoints`, `fetchRagData`, `ragMode`).

### 3. UI Components
- **Create RAG Configuration Components**:
  - `src/lib/components/RagConfig.svelte`: Main view for RAG configuration (similar to `Config.svelte`).
  - `src/lib/components/RagEndpointList.svelte`: List of configured RAG endpoints with edit/delete actions.
  - `src/lib/components/EditRagEndpointForm.svelte`: Form to edit/add RAG endpoints (including specific fields like `mode`).
- **Update `src/lib/components/Popup.svelte`**:
  - Render `RagConfig` when `popupState` is `'RAG_CONFIG'`.
- **Update `src/lib/components/steps/Connection.svelte`**:
  - Add a multi-select UI for RAG endpoints.
  - Add a settings icon to switch `popupState` to `'RAG_CONFIG'`.
- **Update `src/lib/components/steps/Response.svelte`**:
  - Handle `'FETCHING_RAG'` state to display "Fetching RAG Data..." in the status header.

### 4. Logic Implementation
- **Update `src/lib/util/checkFact.svelte.ts`**:
  - Implement `fetchRagData` function to query selected RAG endpoints.
  - In `checkFact`, before calling `fetchModel`:
    - Set state to `'FETCHING_RAG'`.
    - Call `fetchRagData` concurrently for all selected endpoints.
    - Format the RAG results (Entities, Relationships, Chunks).
    - Append the formatted RAG data to the user prompt context.
    - Proceed to `fetchModel` with the augmented context.
