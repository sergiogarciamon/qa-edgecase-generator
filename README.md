# QA Edge-Case & Payload Generator

An automated test design tool that dynamically parses target web applications and generates domain-tailored QA test scenarios, boundary checks, and security payloads.

🚀 **Live Demo:** [https://sergiogarciamon.github.io/QA-Edge-Case-Generator/](https://sergiogarciamon.github.io/QA-Edge-Case-Generator/)

## Key Features

- **Dynamic Domain Parsing**: Automatically extracts domain names, parameters, and targets from input URLs.
- **Automated Scenario Generation**: Creates structured test cases with target locators, execution steps, payloads, and expected outcomes.
- **Safety Payload Handling**: Wraps oversized stress payloads gracefully to prevent UI overflow.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Local Setup

```bash
# Clone the repository
git clone [https://github.com/sergiogarciamon/QA-Edge-Case-Generator.git](https://github.com/sergiogarciamon/QA-Edge-Case-Generator.git)

# Install dependencies
npm install

# Run dev server
npm run dev
