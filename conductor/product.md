# Product Guide

## 1. Overview

This document outlines the product vision for the Fact Check Extension, a browser tool designed to help users verify information they encounter on the web.

## 2. Target Audience

The primary users for this extension are general web users who want to quickly and easily check the validity of news articles, social media posts, and other online content.

## 3. Core Features & Goals

The extension's core functionality allows users to select text or an image on a webpage and submit it to a Large Language Model (LLM) for fact-checking.

The primary goal for the next development cycle is to expand the extension's capabilities to support more content types, such as video and audio clips.

## 4. Non-Functional Requirements

- **Privacy:** The extension must prioritize user privacy by storing all configuration and settings locally on the user's machine. While model providers may store requests, the extension itself will not persist user data externally.
- **Performance:** The extension should be lightweight and have a minimal impact on browser performance. Fact-checking operations should be executed efficiently.
- **Compatibility:** A key requirement is to ensure the extension is fully functional and provides a consistent user experience across major web browsers, including Google Chrome, Mozilla Firefox, and Safari.
