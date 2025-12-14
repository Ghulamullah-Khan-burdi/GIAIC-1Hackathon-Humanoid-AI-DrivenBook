# Chapter 2: Perception: Seeing the World

For a robot to act intelligently in its environment, it first needs to understand what it "sees." This chapter focuses on how Vision-Language-Action (VLA) systems use vision models to perceive the world through a simulated camera and extract meaningful information.

## Camera Input

Robots typically use various types of cameras:
-   **RGB Cameras**: Provide color images, similar to what humans see.
-   **Depth Cameras**: Provide information about the distance to objects.
-   **Stereo Cameras**: Two cameras that mimic human binocular vision to perceive depth.

In simulation, we can easily access these camera feeds as image data.

## Object Recognition

This involves identifying and classifying objects present in the camera's field of view. Modern VLA systems often use large, pre-trained visual models (e.g., from the CLIP family, or vision transformers) that can recognize a vast array of objects.

## Scene Understanding

Beyond just recognizing individual objects, scene understanding involves comprehending the relationships between objects, their attributes (e.g., color, size), and the overall context of the environment. This often feeds into the language model for more informed reasoning.

---

## Exercise: Describe Objects from a Simulated Camera

Let's create a Python script that simulates a robot's camera feed and uses a conceptual vision model to describe the objects it "sees" in a simple simulated environment.

### Step 1: Set Up a Simple Simulated Scene

Assume you have a simple simulation environment (e.g., in Isaac Sim, Gazebo, or even a basic 3D rendering in Python) with a few distinct objects, like a red cube and a blue sphere.

### Step 2: Create a Python Script for Scene Description

This conceptual script will:
1.  Simulate capturing an image from a camera.
2.  Use a placeholder for a vision model to "recognize" objects.
3.  Generate a natural language description of the scene.

```python
# scene_description_script.py
import random

class SimulatedCamera:
    def capture_image(self):
        # In a real scenario, this would return image data from a simulator
        print("Simulating camera capturing image...")
        # Let's assume some known objects are in view
        known_objects = [
            {"name": "red cube", "position": "left", "size": "small"},
            {"name": "blue sphere", "position": "right", "size": "medium"},
            {"name": "green cylinder", "position": "center", "size": "large", "present": False}
        ]
        # Randomly decide if green cylinder is present
        if random.random() < 0.5:
            known_objects[2]["present"] = True
        return known_objects

class VisionModel:
    def __init__(self, known_object_data):
        self.known_object_data = known_object_data

    def recognize_objects(self, image_data):
        # In a real scenario, a deep learning model would process image_data
        # For this exercise, we use our simulated known_object_data
        detected = [obj for obj in image_data if obj.get("present", True)]
        return detected

class SceneDescriber:
    def describe_scene(self, detected_objects):
        descriptions = []
        if not detected_objects:
            return "The scene appears empty."
        
        for obj in detected_objects:
            desc = f"a {obj.get('size', '')} {obj.get('name', 'object')} on the {obj.get('position', '')}"
            descriptions.append(desc.strip())
        
        if len(descriptions) == 1:
            return f"I see {descriptions[0]}."
        elif len(descriptions) == 2:
            return f"I see {descriptions[0]} and {descriptions[1]}."
        else:
            last = descriptions.pop()
            return f"I see {', '.join(descriptions)}, and {last}."

def main():
    camera = SimulatedCamera()
    scene_objects = camera.capture_image()
    
    vision_model = VisionModel(scene_objects)
    detected_objects = vision_model.recognize_objects(scene_objects)
    
    describer = SceneDescriber()
    scene_description = describer.describe_scene(detected_objects)
    
    print(f"\nRobot's perception of the scene: {scene_description}")

if __name__ == "__main__":
    main()
```

### Step 3: Run the Scene Description Script

1.  Place the `scene_description_script.py` file in `docs/module-4-vla/examples/scene_description/`.
2.  Run the script from your terminal:
    ```bash
    python scene_description_script.py
    ```
    Observe the output, which should be a natural language description of the simulated objects. This demonstrates how a robot can use vision to understand its environment and convert that understanding into text.
