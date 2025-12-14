# Chapter 2: Perception Pipelines

Perception is the robot's ability to "see" and understand its environment. In AI-driven robotics, this typically involves using deep learning models to process sensor data (like camera images, Lidar point clouds, or IMU readings) and extract meaningful information. NVIDIA Isaac Sim provides powerful tools for building and testing these perception pipelines.

## Object Detection

Object detection is a computer vision task that identifies and localizes objects within an image or video. For humanoid robots, this is crucial for tasks like:
-   Identifying objects to interact with (e.g., a cup, a tool).
-   Recognizing people and their poses.
-   Understanding the layout of a room.

Isaac Sim allows you to generate synthetic data with ground truth labels (bounding boxes, segmentation masks) at scale, which is invaluable for training robust object detection models without needing to collect and label real-world data manually.

## 2D–3D Perception

Robots often need to understand the 3D world, not just a 2D image. This involves:
-   **Depth Estimation**: Determining the distance to objects.
-   **3D Object Detection**: Localizing objects in 3D space.
-   **Scene Reconstruction**: Building a 3D model of the environment.

## Segmentation

Segmentation takes object detection a step further by classifying each pixel in an image as belonging to a specific object or category. This can be:
-   **Semantic Segmentation**: Classifying each pixel into a category (e.g., "floor", "wall", "person").
-   **Instance Segmentation**: Identifying individual instances of objects (e.g., "cup A", "cup B").

---

## Exercise: Detect Objects in Isaac Sim

In this exercise, we will set up a simple object detection pipeline in Isaac Sim. We'll use a pre-trained model or a simplified script to detect objects from a simulated camera feed.

### Step 1: Set Up an Isaac Sim Scene

1.  Launch Isaac Sim.
2.  Load a simple scene with a few distinct objects (e.g., a cube, a sphere, a cylinder). You can place these manually or load a pre-built environment.
3.  Add a camera sensor to your robot model (or directly to the scene) and configure it to output images.

### Step 2: Create an Object Detection Script

NVIDIA provides examples and APIs for object detection within Isaac Sim. We'll use a simplified conceptual Python script that leverages Isaac Sim's capabilities to access camera data and apply a (conceptual) object detection model.

```python
# object_detection_isaac.py (conceptual script)
from omni.isaac.core.simulation_context import SimulationContext
from omni.isaac.core.objects import DynamicCuboid # Example object
import numpy as np
import time

# Assume we have a simulated camera
# from omni.isaac.synthetic_utils import SyntheticDataHelper # For real data generation

class ObjectDetector:
    def __init__(self, simulation_context):
        self._sim = simulation_context
        self.objects_in_scene = []
        # Add some dummy objects for this conceptual example
        self._sim.world.add(DynamicCuboid(prim_path="/World/cube1", position=np.array([1.0, 0.5, 0.1]), size=0.2, color=np.array([1.0, 0.0, 0.0])))
        self._sim.world.add(DynamicCuboid(prim_path="/World/sphere1", position=np.array([0.5, -0.5, 0.1]), size=0.3, color=np.array([0.0, 1.0, 0.0])))
        self.objects_in_scene.append({"name": "cube1", "position": np.array([1.0, 0.5, 0.1])})
        self.objects_in_scene.append({"name": "sphere1", "position": np.array([0.5, -0.5, 0.1])})
        
        self.camera_position = np.array([0.0, 0.0, 1.0]) # Conceptual camera pos

    def get_camera_image(self):
        # In a real Isaac Sim scenario, this would capture the camera image
        # For conceptual example, we'll just simulate perception
        return "simulated_image_data"

    def run_detection(self, image_data):
        # In a real Isaac Sim scenario, this would use a DL model
        # For conceptual example, we'll "detect" based on known objects and camera view
        detected_objects = []
        for obj in self.objects_in_scene:
            # Simple conceptual check: is object roughly in camera's view?
            if np.linalg.norm(obj["position"] - self.camera_position) < 2.0: # Arbitrary distance
                detected_objects.append({"label": obj["name"], "confidence": 0.95})
        return detected_objects

    def visualize_detection(self, detections):
        print("\n--- Detection Results ---")
        if detections:
            for det in detections:
                print(f"Detected: {det['label']} (Confidence: {det['confidence']:.2f})")
        else:
            print("No objects detected.")
        print("-------------------------\n")


def main():
    simulation_context = SimulationContext()
    object_detector = ObjectDetector(simulationContext=simulation_context)

    # Simulate running Isaac Sim
    simulation_context.play()
    for i in range(5):
        simulation_context.step(render=True)
        print(f"Simulation step {i+1}")
        image_data = object_detector.get_camera_image()
        detections = object_detector.run_detection(image_data)
        object_detector.visualize_detection(detections)
        time.sleep(1.0) # Simulate real-time
    simulation_context.stop()

if __name__ == "__main__":
    main()
```

### Step 3: Run the Detection

1.  Launch Isaac Sim and load your scene.
2.  Run your Python script.
    ```bash
    python object_detection_isaac.py
    ```
    Observe the console output showing detected objects. In a full Isaac Sim setup, you would visually see bounding boxes or overlays in the simulator.

This exercise provides a hands-on introduction to integrating AI perception models within the Isaac Sim environment.
