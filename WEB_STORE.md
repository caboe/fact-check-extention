# Fact Spreader

Are you tired of wading through questionable claims while browsing? The Fact Spreader Chrome Extension is your ultimate companion for cutting through the noise. With a simple highlight and click, you can send any piece of text on a webpage to your choice of advanced language models (LLMs)—including public services like ChatGPT or local models such as Ollama—to receive diverse fact-checking insights in real time.

**Important Note**: The extension itself does not perform fact-checking. Instead, it provides a streamlined workflow that lets you easily submit text to your configured AI endpoints, which then provide the analysis or verification.

## Key Features

### ✨ **Instant Fact-Checking**

Highlight any text on a webpage, and with a single click, transmit it to powerful AI models to get instant clarity on claims. Whether you're reading news articles, social media posts, or research papers, verifying information has never been easier.

### 🔄 **Flexible Model Support**

Seamlessly switch between online models for convenience or offline local models for enhanced privacy and security. Support for popular services including:

- Online: ChatGPT, Google Gemini, Claude, and more
- Local: Ollama, LM Studio, and other locally-hosted models

### 🎭 **Customizable Roles**

Define the persona of your fact-checker to tailor the analysis tone and perspective:

- **Scientist**: Analytical and methodical approach
- **Acerbic Rationalist**: Critical and skeptical perspective
- **Custom Roles**: Create your own personas for specific use cases

### 📏 **Context & Precision Control**

Add custom context to your queries and control the response length with an intuitive word count slider. Get exactly the level of detail you need—concise summaries or in-depth analyses.

### 📊 **Comprehensive Insights**

Compare responses from different LLMs side by side, offering multiple perspectives and deeper verification. Make informed decisions by seeing how various models interpret the same information.

### 🖼️ **Image Fact-Checking**

Don't limit yourself to text! Right-click on any image to fact-check visual content using models that support image analysis.

### 🎨 **User-Friendly Interface**

Enjoy a clean, intuitive design that makes navigation simple and results easy to understand. No technical expertise required—just highlight, click, and get results.

### 🔒 **Privacy First**

Keep sensitive data under your control when using local models without compromising performance. All configurations are stored locally in your browser.

---

### 🧠 **Optional: Advanced RAG Integration**

Take your fact-checking to the next level with optional lightRAG integration! Connect to your own knowledge graph for enhanced verification capabilities.

**Why use lightRAG?**

- Ground fact-checks in your trusted knowledge sources
- Access relevant entities, relationships, and contextual data
- Perfect for specialized topics requiring domain expertise
- Get more accurate results by leveraging verified information

**How it works:**

1. Add your lightRAG endpoint in the RAG Configuration
2. Choose from multiple retrieval modes (Local, Global, Hybrid, Naive, Mix)
3. Toggle RAG on/off as needed for each check
4. Receive enriched context from your knowledge graph alongside AI analysis

**Technical Requirements:**

- A running lightRAG instance with an accessible API endpoint
- API endpoint should support POST requests with query, mode, and top_k parameters
- Optional: API key for secured endpoints

_Note: This is an optional feature. All core fact-checking functionality works perfectly without lightRAG configuration._

---

Transform the way you consume information online with Fact Spreader — your personal workflow assistant for truth verification. Always remember to use reputable and trusted sources when verifying the accuracy of what you read.

**More information**: https://github.com/caboe/fact-check-extention

**Download now and navigate the web with confidence!**
