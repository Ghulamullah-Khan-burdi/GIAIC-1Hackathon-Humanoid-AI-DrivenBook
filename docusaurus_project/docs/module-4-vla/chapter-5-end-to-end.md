# Chapter 5: End-to-End VLA Pipeline

Having explored the individual components of Vision-Language-Action (VLA) systems – perception, planning, and acting – we now integrate them into a complete, end-to-end pipeline. This chapter culminates in building a system where a humanoid robot can receive a voice command, understand it, perceive its environment, formulate a plan, and execute the physical actions.

## Voice Input

The most natural way for humans to interact with robots is through voice. Integrating voice input involves:
-   **Speech-to-Text (STT)**: Converting spoken words into text.
-   **Natural Language Processing (NLP)**: Extracting intent and entities from the text.

## Perception + Planning + Action

The end-to-end VLA pipeline ties together the modules we've discussed:
1.  **Voice Input**: User speaks a command.
2.  **Speech-to-Text**: Converts voice to text.
3.  **Language Model (LLM)**: Interprets the text command and decomposes it into sub-tasks.
4.  **Vision Model (VLM)**: Provides real-time scene understanding from camera feeds.
5.  **Planning Loop**: Combines LLM output and VLM input to generate a detailed action plan.
6.  **Action Execution**: Maps sub-tasks to ROS 2 actions and controls the robot's hardware/simulation.
7.  **Feedback**: Robot provides visual or verbal feedback on progress.

## Safety and Correction Loops

In an end-to-end system, safety is paramount. The planning and execution components must include robust error handling, collision avoidance, and potentially human-in-the-loop oversight to prevent unintended actions.

---

## Exercise: "Pick up the Red Cube" Complete Pipeline

Let's build a conceptual end-to-end VLA pipeline where a robot can respond to a voice command like "Pick up the red cube."

### Step 1: Conceptual Speech-to-Text Integration

Assume you have a speech-to-text system (e.g., Google Speech-to-Text API, local inference model) that provides the text input.

### Step 2: Integrate Previous Chapters' Components

Combine the conceptual scripts from Chapter 2 (Perception), Chapter 3 (Planning), and Chapter 4 (Action Execution) into a single orchestration script.

```python
# full_vla_pipeline.py (conceptual script)
import rclpy
from rclpy.node import Node
import time
import random

# Import conceptual classes from previous chapters
from examples.scene_description.scene_description_script import SimulatedCamera, VisionModel, SceneDescriber
from examples.task_planning.task_planning_script import LanguageModel
from examples.action_execution.action_execution_script import GraspActionClient

class VLAPipelineNode(Node):
    def __init__(self):
        super().__init__('vla_pipeline_node')
        self.camera = SimulatedCamera()
        self.vision_model = VisionModel(self.camera.known_objects) # Pass known objects for simulation
        self.scene_describer = SceneDescriber()
        self.language_model = LanguageModel()
        self.grasp_action_client = GraspActionClient() # ROS 2 action client

    def process_voice_command(self, voice_input_text):
        self.get_logger().info(f"Received command: '{voice_input_text}'")

        # 1. Perception (Scene Understanding)
        scene_objects_data = self.camera.capture_image()
        detected_objects = self.vision_model.recognize_objects(scene_objects_data)
        scene_description = self.scene_describer.describe_scene(detected_objects)
        self.get_logger().info(f"Scene perceived: {scene_description}")

        # 2. Planning (Task Decomposition)
        sub_tasks = self.language_model.decompose_task(voice_input_text, scene_description)
        self.get_logger().info(f"Decomposed into sub-tasks: {sub_tasks}")

        # 3. Action Execution (Iterate through sub-tasks)
        for task in sub_tasks:
            self.get_logger().info(f"Executing sub-task: {task}")
            if "localize_" in task:
                object_name = task.replace("localize_", "")
                self.get_logger().info(f"Robot localizing {object_name}...")
                time.sleep(1) # Simulate localization time
            elif "navigate_to_" in task:
                object_name = task.replace("navigate_to_", "")
                self.get_logger().info(f"Robot navigating to {object_name}...")
                # In real VLA, this would trigger a NavigateToPose ROS action
                time.sleep(2) # Simulate navigation time
            elif "grasp_" in task:
                object_name = task.replace("grasp_", "")
                self.get_logger().info(f"Robot attempting to grasp {object_name}...")
                # This would trigger a GraspObject ROS action
                self.grasp_action_client.send_grasp_goal(object_name) # Conceptual call
                self.get_logger().info(f"Grasp action sent for {object_name}")
                time.sleep(3) # Simulate grasp time
            elif "lift_" in task:
                object_name = task.replace("lift_", "")
                self.get_logger().info(f"Robot lifting {object_name}...")
                time.sleep(1) # Simulate lift time
            else:
                self.get_logger().warning(f"Unknown sub-task: {task}")
            
            # Conceptual: check for success/failure and re-plan if needed
            self.get_logger().info(f"Sub-task '{task}' completed.")

        self.get_logger().info("Full command execution complete.")


def main(args=None):
    rclpy.init(args=args)
    vla_pipeline_node = VLAPipelineNode()

    # Simulate a voice command
    # In a real system, this would come from an STT module
    voice_command = "Pick up the red cube" 
    vla_pipeline_node.process_voice_command(voice_command)

    # For demonstration, spin once then shutdown
    rclpy.spin_once(vla_pipeline_node, timeout_sec=5)
    vla_pipeline_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Step 3: Run the End-to-End Pipeline

1.  Ensure your ROS 2 environment is sourced.
2.  Run your Python script.
    ```bash
    ros2 run YOUR_PACKAGE_PACKAGE full_vla_pipeline
    ```
    Observe the console output detailing the robot's perception, planning, and simulated action execution in response to the voice command. This exercise demonstrates the power of combining VLA capabilities to achieve complex robotic tasks.
