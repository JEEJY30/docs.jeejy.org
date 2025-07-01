---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
weight: 50
difficulty: "beginner" # beginner, intermediate, advanced
duration: "30 minutes"
prerequisites:
  - "Basic understanding of X"
  - "Familiarity with Y"
objectives:
  - "Learn how to..."
  - "Understand the concept of..."
  - "Build a working..."
resources:
  - name: "Source Code"
    url: "https://github.com/yourusername/..."
  - name: "Live Demo"
    url: "https://..."
summary: ""
description: ""
keywords: []
tags: []
categories: []
technologies: []
series: []
author:
  name: "{{ .Site.Params.author.name }}"
  email: "{{ .Site.Params.author.email }}"
cover:
  image: ""
  alt: ""
  caption: ""
  relative: false
showToc: true
TocOpen: true
comments: true
codeMaxLines: 50
codeLineNumbers: true
figurePositionShow: true
---

## Overview

{{< learning-objectives >}}

## Prerequisites

{{< prerequisites >}}

## Setup

[Environment setup instructions]

## Step 1: [First Step Title]

[Content for step 1]

{{< code-group >}}
```javascript {title="JavaScript"}
// Your code here
# Your code here
{{< /code-group >}}
Step 2: [Second Step Title]
[Content for step 2]
{{< interactive-demo src="/demos/demo1.html" height="400" >}}
Practice Exercise
{{< exercise title="Exercise 1: [Title]" >}}
[Exercise description]
Task: [What the user needs to do]
<details>
<summary>Solution</summary>
javascript// Solution code
</details>
{{< /exercise >}}
Summary
[What we learned]
Next Steps

Next tutorial in series
Related tutorial

Additional Resources
{{< resources >}}
### archetypes/projects.md
```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
weight: 50
summary: ""
description: ""
keywords: []
tags: []
categories: []
technologies: []
author:
  name: "{{ .Site.Params.author.name }}"
  email: "{{ .Site.Params.author.email }}"
project:
  name: "{{ replace .Name "-" " " | title }}"
  description: ""
  status: "in-progress" # planning, in-progress, completed, maintained
  startDate: {{ .Date }}
  endDate: ""
  repository: "https://github.com/yourusername/..."
  demo: "https://..."
  documentation: "https://..."
  license: "MIT"
  featured: false
  techStack:
    - "Technology 1"
    - "Technology 2"
  features:
    - "Feature 1"
    - "Feature 2"
  screenshots:
    - src: "/img/projects/screenshot1.png"
      alt: "Screenshot description"
    - src: "/img/projects/screenshot2.png"
      alt: "Screenshot description"
metrics:
  stars: 0
  forks: 0
  contributors: 1
  commits: 0
  issues: 0
  pullRequests: 0
cover:
  image: ""
  alt: ""
  caption: ""
  relative: false
showToc: true
comments: true
---

## Project Overview

[Detailed project description]

## Features

{{< features >}}

## Tech Stack

{{< tech-stack >}}

## Architecture

```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Service 1]
    B --> D[Service 2]
    C --> E[Database]
    D --> E
    Installation
{{< tabs >}}
{{< tab "Docker" >}}
bashdocker-compose up -d
{{< /tab >}}
{{< tab "Manual" >}}
bashnpm install
npm run build
npm start
{{< /tab >}}
{{< /tabs >}}
Usage
[Usage instructions]
API Documentation
{{< api-docs src="/api/openapi.yaml" >}}
Contributing
[Contributing guidelines]
Roadmap

 Feature 1
 Feature 2
 Completed feature

License
This project is licensed under the MIT License.
## Custom Shortcodes

### layouts/shortcodes/code-group.html
```html
<div class="code-group" x-data="{ activeTab: 0 }">
  <div class="code-group-tabs">
    {{ range $index, $element := .Inner | split "```" }}
      {{ if mod $index 2 }}
        {{ $lang := index (split $element " ") 0 }}
        {{ $title := "" }}
        {{ with findRE `{title="([^"]+)"}` $element 1 }}
          {{ $title = index (split (index . 0) "\"") 1 }}
        {{ else }}
          {{ $title = $lang }}
        {{ end }}
        <button 
          class="code-group-tab" 
          :class="{ 'active': activeTab === {{ div $index 2 }} }"
          @click="activeTab = {{ div $index 2 }}"
        >
          {{ $title }}
        </button>
      {{ end }}
    {{ end }}
  </div>
  <div class="code-group-content">
    {{ range $index, $element := .Inner | split "```" }}
      {{ if mod $index 2 }}
        <div 
          class="code-group-panel"
          x-show="activeTab === {{ div $index 2 }}"
          x-transition
        >
          {{ $element | markdownify }}
        </div>
      {{ end }}
    {{ end }}
  </div>
</div>