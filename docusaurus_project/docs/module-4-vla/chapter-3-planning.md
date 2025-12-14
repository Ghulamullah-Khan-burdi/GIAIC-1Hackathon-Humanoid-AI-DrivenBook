# Chapter 3: Planning: Understanding Instructions

Once a robot can perceive its environment, the next crucial step in a Vision-Language-Action (VLA) system is to understand human instructions and translate them into a coherent plan of action. This involves **task decomposition** and operating within a **VLA planning loop**.

## Task Decomposition

Human commands are often high-level and abstract (e.g., "make coffee"). For a robot, this needs to be broken down into a sequence of smaller, executable steps (e.g., "go to coffee machine," "grasp cup," "press button"). Task decomposition uses language models (LLMs) to:
-   **Interpret the Intent**: Understand the core goal of the human command.
-   **Break Down into Sub-tasks**: Generate a sequence of simpler actions the robot can perform.
-   **Incorporate Context**: Use perceived environmental information (from vision models) to refine the plan.

## VLA Planning Loop

A robot doesn't just execute a static plan. It typically operates in a loop:
1.  **Perceive**: Gather sensor data (vision, depth, etc.).
2.  **Understand**: Interpret the human command and current scene.
3.  **Plan**: Generate or refine the sequence of actions.
4.  **Act**: Execute the next action in the plan.
5.  **Monitor**: Observe the outcome and provide feedback, potentially restarting the loop if adjustments are needed.

---

## Exercise: Convert a User Request into Sub-Tasks

Let's create a Python script that simulates an LLM receiving a high-level user request and decomposing it into a series of robotic sub-tasks.

### Step 1: Define User Requests

Consider a few example user requests for a robot (e.g., "pick up the blue ball," "open the door," "put the cup on the table").

### Step 2: Create a Task Decomposition Script

This conceptual script will take a user request and use a placeholder for an LLM to generate a sequence of sub-tasks.

```python
# task_planning_script.py
class LanguageModel:
    def __init__(self):
        # In a real scenario, this would initialize a powerful LLM
        pass

    def decompose_task(self, user_request, current_scene_description=""):
        print(f"LLM processing request: '{user_request}' with scene: '{current_scene_description}'")
        # Conceptual task decomposition logic
        if "pick up" in user_request.lower() and "red cube" in user_request.lower():
            return [
                "1. localize_red_cube",
                "2. navigate_to_red_cube",
                "3. grasp_red_cube",
                "4. lift_red_cube"
            ]
        elif "open the door" in user_request.lower():
            return [
                "1. localize_door",
                "2. navigate_to_door",
                "3. grasp_door_handle",
                "4. push_door"
            ]
        elif "put the cup on the table" in user_request.lower():
            return [
                "1. localize_cup",
                "2. navigate_to_cup",
                "3. grasp_cup",
                "4. localize_table",
                "5. navigate_to_table",
                "6. place_cup_on_table"
            ]
        else:
            return ["Cannot decompose this request. Please try again."]

def main():
    llm = LanguageModel()
    
    # Example 1
    user_request_1 = "Pick up the red cube"
    sub_tasks_1 = llm.decompose_task(user_request_1, "A red cube is on the floor.")
    print(f"\nRequest: '{user_request_1}'")
    print("Sub-tasks:")
    for task in sub_tasks_1:
        print(task)

    # Example 2
    user_request_2 = "Open the door"
    sub_tasks_2 = llm.decompose_task(user_request_2, "A closed door is in front of the robot.")
    print(f"\nRequest: '{user_request_2}'")
    print("Sub-tasks:")
    for task in sub_tasks_2:
        print(task)

if __name__ == "__main__":
    main()
```

### Step 3: Run the Task Planning Script

1.  Place the `task_planning_script.py` file in `docs/module-4-vla/examples/task_planning/`.
2.  Run the script from your terminal:
    ```bash
    python task_planning_script.py
    ```
    Observe how the script breaks down high-level commands into a series of robotic sub-tasks. This is a core component of how VLA systems enable robots to understand and plan for complex actions.
