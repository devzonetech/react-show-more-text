# Agent Instructions

## General Workflow

For every issue or feature request, follow the workflow below. Complete all applicable steps before considering the task finished.

### 1. Analyze and Resolve the Issue

- Read and understand the complete issue description.
- Inspect the existing implementation and identify the root cause or required changes.
- Review the existing architecture, coding conventions, and project structure before making changes.
- Implement the solution following the existing patterns and best practices.
- Avoid unnecessary refactoring or changes unrelated to the issue.
- Ensure backward compatibility unless a breaking change is explicitly requested.

### 2. Write Unit Tests

- Add unit tests for all new functionality.
- Update existing tests when modifying existing behavior.
- Add regression tests for bug fixes.
- Cover relevant edge cases and expected behavior.
- Follow the existing testing framework, test structure, and naming conventions.
- Ensure all relevant tests pass.

### 3. Update TypeScript Types

- Update existing TypeScript type definitions to reflect changes in the public API.
- Add type definitions for new features, component props, configuration options, and exported functionality.
- Ensure types accurately represent the actual implementation.
- Prefer explicit and reusable types over unnecessary duplication.
- Use appropriate TypeScript utility types when beneficial.
- Ensure exported types are accessible to consumers of the package when applicable.
- Maintain backward compatibility with existing type definitions unless a breaking change is explicitly requested.
- Add or update type tests to verify type correctness and prevent regressions.
- Run TypeScript type checking to validate the changes.

### 4. Create or Update Storybook Stories

- For every new user-facing feature, create a corresponding Storybook story demonstrating the feature.
- For bug fixes, update or add a Storybook story when it helps demonstrate the corrected behavior.
- Include relevant usage scenarios, configuration options, and edge cases.
- Follow the existing Storybook structure and conventions.
- Ensure the stories render and work correctly.

### 5. Update README.md

Keep the README.md documentation synchronized with the implementation.

- Update the relevant documentation sections to reflect changes in behavior or API.
- Add every new user-facing feature to the Features list.
- Include usage examples for new features when appropriate.
- Update component props, configuration options, TypeScript types, and API documentation when necessary.
- Ensure all examples reflect the actual implementation.
- Do not add bug fixes or internal implementation details to the Features list.

### 6. Update CHANGELOG.md

Every issue or feature implementation must include an appropriate changelog entry.

- Add the entry under the next unreleased version section.
- Follow the existing CHANGELOG.md structure and formatting.
- Categorize each change under the appropriate section:
  - **FIX** – Bug fixes and corrections.
  - **ADD** – New features and functionality.
  - **REMOVED** – Removed features, APIs, or functionality.
- Write a concise description explaining what changed from the user's perspective.
- Do not modify previously released version entries.
- Do not increment or change the package version unless explicitly requested.

### 7. Validate Changes

Before completing the task:

- Run the relevant unit tests.
- Run TypeScript type checking.
- Run linting and formatting checks.
- Validate Storybook stories.
- Run the production build.
- Resolve any errors introduced by the changes.
- Do not claim that a check passed if it was not executed successfully.

### 8. Final Review

Review the complete changeset and verify that:

- The issue has been resolved.
- Unit tests cover the implementation.
- TypeScript definitions accurately represent the implementation and public API.
- Storybook demonstrates new user-facing features.
- README.md reflects the current functionality.
- CHANGELOG.md contains the appropriate entry.
- No unrelated files or functionality have been unnecessarily modified.

## Important Rules

- Follow the existing project architecture and conventions.
- Prefer minimal, focused changes.
- Do not introduce unnecessary dependencies.
- Do not duplicate existing functionality.
- Do not remove existing functionality without explicit authorization.
- Do not invent APIs, props, or behavior that are not implemented.
- Keep documentation, TypeScript types, tests, Storybook examples, and implementation consistent.