# Chapter 5: Launch Files & Package Architecture

As your ROS 2 robot application grows, you'll have many nodes, each performing a specific task. Manually starting each node in its own terminal can quickly become cumbersome and error-prone. This is where **launch files** come in. Launch files allow you to define and manage the startup of multiple nodes, their parameters, and other configurations with a single command.

## Creating a ROS 2 Package

Every ROS 2 application lives within a package. A package is a container for your source code, configuration files, launch files, and other resources.

To create a new package (if you haven't already from previous exercises):
```bash
cd <your_ros2_workspace>/src
ros2 pkg create --build-type ament_python my_robot_package # for Python
# or
ros2 pkg create --build-type ament_cmake my_robot_package # for C++
```
This creates a basic directory structure for your package.

## Launching Multiple Nodes

Launch files are XML or Python files (Python launch files are more flexible and recommended for ROS 2) that define how to start your nodes.

Here's a simple example of a Python launch file that starts two nodes: a publisher and a subscriber.

```python
# my_robot_package/launch/my_robot_launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_robot_package',
            executable='simple_publisher', # Assuming simple_publisher.py is in install/my_robot_package/lib/my_robot_package
            name='my_publisher_node',
            output='screen',
            emulate_tty=True
        ),
        Node(
            package='my_robot_package',
            executable='simple_subscriber', # Assuming simple_subscriber.py is in install/my_robot_package/lib/my_robot_package
            name='my_subscriber_node',
            output='screen',
            emulate_tty=True
        )
    ])
```

## Example Robot Launch

You would place your Python scripts (`simple_publisher.py`, `simple_subscriber.py`) in your package's `my_robot_package/my_robot_package/` directory. Remember to update your `setup.py` and `CMakeLists.txt` files (if using C++) to install these executables.

To run the launch file:
```bash
source install/setup.bash # from your workspace root
ros2 launch my_robot_package my_robot_launch.py
```

This single command will now start both your publisher and subscriber nodes, and you'll see their output in the terminal.

---

## Exercise: Build a Full Launch File for a Simple Robot

Take the nodes you created in previous chapters (IMU publisher, motor controller, action client) and integrate them into a single ROS 2 package with a comprehensive launch file.

1.  **Create a Package**: If you haven't already, create a ROS 2 Python package (e.g., `humanoid_robot_control`).
2.  **Move Nodes**: Place your Python node scripts (from previous exercises, e.g., `imu_publisher.py`, `motor_controller.py`, `simple_navigation_action_client.py`) into the `humanoid_robot_control/humanoid_robot_control/` directory.
3.  **Create `setup.py` entries**: Ensure your `setup.py` includes `entry_points` for each of your nodes so they can be run as executables.
4.  **Write a Launch File**: Create a `launch/full_robot_launch.py` file within your package. This launch file should start all your nodes:
    -   `imu_publisher`
    -   `motor_controller`
    -   `simple_navigation_action_client` (or similar, if you developed an action server too)
5.  **Build and Run**:
    ```bash
    cd <your_ros2_workspace>
    colcon build --packages-select humanoid_robot_control
    source install/setup.bash
    ros2 launch humanoid_robot_control full_robot_launch.py
    ```
    Verify that all your nodes start and interact as expected. This completes the "nervous system" for your humanoid robot!
