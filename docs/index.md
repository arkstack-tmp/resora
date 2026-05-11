---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Resora'
  tagline: A structured API response layer for Node.js and TypeScript with automatic JSON responses, collection support, and pagination handling
  image:
    src: /banner.png
    alt: Resora
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Examples
      link: /api/resource
features:
  - icon:
      src: /icons/file-code-fill.svg
    title: Structured JSON Contracts
    details: Enforces a consistent API response envelope with predictable data and metadata handling across your application.
  - icon:
      src: /icons/handbag-fill.svg
    title: Resource & Collection Abstractions
    details: Define transformation logic once and reuse it across single entities, arrays, paginated results, and cursor-based datasets.
  - icon:
      src: /icons/pages-fill.svg
    title: Automatic Pagination & Cursor Meta
    details: Pagination and cursor metadata are automatically normalized into a structured meta object without manual merging.
  - icon:
      src: /icons/bus-2-fill.svg
    title: Transport-Aware Response Binding
    details: Seamlessly bind to Express, H3, and Connect-style frameworks with status, headers, and cookies while preserving data integrity.
  - icon:
      src: /icons/typescript-fill.svg
    title: TypeScript-First Design
    details: Built with strict typing in mind to ensure safe transformations and reliable API contracts.
  - icon:
      src: /icons/plug-fill.svg
    title: Extensible by Design
    details: Override transformation logic, customize metadata, and shape output without coupling to any specific framework.
---
