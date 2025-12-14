# Chapter 4: Unity Robotics Integration

Unity, a powerful game engine, offers exceptional capabilities for high-fidelity visualization and creating rich interactive environments. When combined with ROS 2, it forms a potent platform for robotics simulation.

## Unity Robotics Hub

The Unity Robotics Hub provides a suite of tools and packages to facilitate seamless integration between Unity and ROS. Key components include:
-   **ROS-TCP-Connector**: Enables communication between Unity and ROS 2 over TCP/IP.
-   **ROS-Messages**: Provides C# equivalents of standard ROS 2 message types.
-   **URDF Importer**: Allows importing URDF robot models directly into Unity.

## ROS–Unity Communication

Communication between ROS and Unity typically involves:
1.  **ROS 2 side**: Standard ROS 2 nodes publishing and subscribing to topics.
2.  **Unity side**: C# scripts running in Unity that use the ROS-TCP-Connector to send and receive ROS messages.

This allows you to leverage ROS 2 for robot control, navigation, and perception logic, while Unity handles the rendering and detailed environmental interaction.

---

## Exercise: Build a Unity Scene & Control a Robot from ROS

Let's create a simple Unity scene with our humanoid robot model and control its head joint using a ROS 2 topic.

### Step 1: Set up a New Unity Project

1.  Open Unity Hub and create a new 3D project.
2.  Install the Unity Robotics Hub packages (ROS-TCP-Connector, ROS-Messages, URDF Importer) via the Package Manager.
3.  Import your `simple_torso.urdf` model into Unity using the URDF Importer.

### Step 2: Create a ROS Publisher in Unity (Conceptual)

In a real scenario, you'd have a C# script in Unity subscribing to a ROS topic for motor commands. For this exercise, we will conceptualize the Unity side and focus on the ROS 2 controller.

### Step 3: Create a ROS 2 Controller Node (Python)

Create a Python ROS 2 node that publishes rotation commands (e.g., `std_msgs/Float32`) to a topic that your Unity robot would subscribe to (e.g., `/head_joint_command`).

```python
# ros_unity_controller.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import math

class ROSUnityController(Node):

    def __init__(self):
        super().__init__('ros_unity_controller')
        self.publisher_ = self.create_publisher(Float32, 'head_joint_command', 10)
        timer_period = 0.1  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.angle = 0.0
        self.direction = 1

    def timer_callback(self):
        msg = Float32()
        # Oscillate between -90 and 90 degrees (approx -1.57 to 1.57 radians)
        self.angle += self.direction * 0.05 # Increment by 0.05 radians
        if self.angle > math.pi / 2:
            self.angle = math.pi / 2
            self.direction = -1
        elif self.angle < -math.pi / 2:
            self.angle = -math.pi / 2
            self.direction = 1
        
        msg.data = self.angle # Publish angle in radians
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing head joint command: {msg.data:.2f} rad')

def main(args=None):
    rclpy.init(args=args)
    ros_unity_controller = ROSUnityController()
    rclpy.spin(ros_unity_controller)
    ros_unity_controller.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Step 4: Run the ROS 2 Controller

1.  Ensure your Unity project (with the imported robot and ROS-TCP-Connector) is running and configured to listen to `/head_joint_command`.
2.  In a terminal, source your ROS 2 environment and run your Python controller node:
    ```bash
    ros2 run YOUR_PACKAGE_NAME ros_unity_controller
    ```
    You should observe the head of your robot model in the Unity scene moving back and forth as commanded by the ROS 2 node.

This exercise demonstrates the fundamental bridge between ROS 2 control logic and Unity's high-fidelity visualization.
