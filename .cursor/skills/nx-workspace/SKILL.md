---
name: Nx Workspace Management
description: Guidelines for using Nx tools, generators, and task execution in the monorepo workspace.
---

# Nx Workspace Management

This skill provides guidelines for working with the Nx monorepo workspace, including generators, tasks, and workspace tools.

## When to Use

- When generating new code, components, or features
- When running tasks (test, build, lint)
- When understanding workspace structure or dependencies
- When troubleshooting Nx configuration or project graph issues

## Workspace Context

You are in an Nx workspace using Nx 21.2.0 and npm as the package manager.

You have access to the Nx MCP server and the tools it provides. Always use these tools when working with Nx-related tasks.

## General Guidelines

### Understanding the Workspace

- When answering questions, use the `nx_workspace` tool first to gain an understanding of the workspace architecture
- For questions around Nx configuration, best practices, or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs
- Always use `nx_docs` instead of assuming things about Nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- To help answer questions about the workspace structure or demonstrate how tasks depend on each other, use the `nx_visualize_graph` tool

## Generation Guidelines

When the user wants to generate something, follow this flow:

1. **Learn about the workspace**: Use `nx_workspace` tool and `nx_project_details` tool if applicable
2. **Get available generators**: Use `nx_generators` tool to see what's available
3. **Decide which generator to use**: If no generators seem relevant, check `nx_available_plugins` to see if a plugin could help
4. **Get generator details**: Use `nx_generator_schema` tool to understand generator options
5. **Learn more if needed**: Use `nx_docs` tool to learn more about a specific generator or technology
6. **Decide on options**: Don't make assumptions, keep options minimalistic
7. **Open generator UI**: Use `nx_open_generate_ui` tool with the selected options
8. **Wait for completion**: Wait for the user to finish the generator
9. **Read generator log**: Use `nx_read_generator_log` tool to see what was generated
10. **Continue with work**: Use the information from the log file to answer questions or continue

## Running Tasks Guidelines

When the user wants help with tasks or commands (test, build, lint, etc.), follow this flow:

1. **Get running tasks**: Use `nx_current_running_tasks_details` tool to get the list of tasks (includes completed, stopped, or failed tasks)
2. **Ask for specific task**: If there are tasks, ask the user if they would like help with a specific task
3. **Get task output**: Use `nx_current_running_task_output` tool to get the terminal output for that task/command
4. **Analyze output**: Use the terminal output to see what's wrong and help fix the problem
5. **Rerun tasks**: If the user wants to rerun a task, always use `nx run <taskId>` to rerun in the terminal. This ensures the task runs in the Nx context the same way it originally executed
6. **Continuous tasks**: If a task was marked as "continuous", do not offer to rerun it. The task is already running and the user can see the output. Use `nx_current_running_task_output` to get the output to verify

## Instructions

1. **Always use Nx tools**: Use the Nx MCP server tools instead of making assumptions
2. **Check workspace first**: Use `nx_workspace` to understand structure before generating or modifying code
3. **Use documentation**: Always use `nx_docs` for configuration questions
4. **Generator flow**: Follow the complete generation flow from discovery to completion
5. **Task execution**: Use `nx run <taskId>` for rerunning tasks to maintain Nx context
6. **Visualize dependencies**: Use `nx_visualize_graph` to help understand project or task dependencies
