// static/content.ts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getSelectedText') {
	  const selectedText = window.getSelection()?.toString() || '';
	  sendResponse({ text: selectedText });
	}
  });
  