# Chapter 3: Gazebo Simulation Basics

Gazebo is a powerful 3D robotics simulator widely used in the ROS community. It allows you to accurately simulate robots, sensors, and environments, complete with realistic physics.

## Load URDF in Gazebo

To bring your robot model to life in Gazebo, you'll typically use a launch file that loads your URDF/Xacro model into a Gazebo world.

A common way to do this involves:
1.  **Defining a Gazebo world**: An XML file that describes the environment (e.g., ground plane, lighting, static objects).
2.  **Using `ros_gz_sim`**: A ROS 2 package that provides tools for bridging Gazebo and ROS 2, including a launch system for Gazebo.

### Example Gazebo World File

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="humanoid_balance_world">
    <include>
      <uri>model://sun</uri>
    </include>
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Gravity -->
    <gravity>0 0 -9.8</gravity>
    <physics type="ode">
      <ode>
        <solver>
          <type>quick</type>
          <iters>50</iters>
          <sor>1.0</sor>
        </solver>
        <constraints>
          <cfm>0.0</cfm>
          <erp>0.2</erp>
        </constraints>
      </ode>
    </physics>

  </world>
</sdf>
```

## Apply Physics: Gravity, Joints

Gazebo's physics engine automatically applies forces like gravity and handles collisions and joint limits based on the properties defined in your URDF. You can configure various physics parameters (like solver type, iterations, etc.) within your Gazebo world file.

## Add Sensors

While the URDF can define the presence of a sensor, to make it functional in Gazebo (e.g., publishing data to a ROS topic), you'll often use Gazebo plugins. These plugins are added to your URDF/Xacro files.

For example, a camera plugin would tell Gazebo to render images from a specific viewpoint and publish them as ROS messages.

---

## Exercise: Make a Humanoid Stand + Balance

Using the simple humanoid torso URDF you created, let's load it into Gazebo and see if it can balance. This exercise highlights the importance of correctly defining inertial properties and joint limits.

### Step 1: Create a Gazebo Launch File

Create a Python launch file (e.g., `humanoid_gazebo.launch.py`) in your `docs/module-2-digital-twin/examples/gazebo_simulation/` directory. This launch file will:
1.  Launch Gazebo with your custom world.
2.  Spawn your `simple_torso.urdf` model.

```python
# humanoid_gazebo.launch.py
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch_ros.actions import Node

def generate_launch_description():
    # Path to your URDF model
    urdf_file = os.path.join(
        get_package_share_directory('YOUR_PACKAGE_NAME'), # Replace with your ROS 2 package name
        'urdf', # Assuming your URDF is in a 'urdf' subdirectory
        'simple_torso.urdf' # Your URDF file name
    )
    
    # Path to your custom Gazebo world
    world_file = os.path.join(
        get_package_share_directory('YOUR_PACKAGE_NAME'), # Replace with your ROS 2 package name
        'worlds', # Assuming your world is in a 'worlds' subdirectory
        'humanoid_balance_world.sdf' # Your SDF world file name
    )

    # Launch Gazebo
    gazebo_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(get_package_share_directory('ros_gz_sim'), 'launch', 'gz_sim.launch.py')
        ),
        launch_arguments={'gz_args': world_file}.items()
    )

    # Spawn the robot model
    spawn_entity = Node(
        package='ros_gz_spawn_entity',
        executable='ros_gz_spawn_entity',
        arguments=['-entity', 'simple_humanoid_torso',
                   '-file', urdf_file,
                   '-x', '0', '-y', '0', '-z', '1'], # Initial position
        output='screen'
    )

    return LaunchDescription([
        gazebo_launch,
        spawn_entity
    ])
```

### Step 2: Run the Simulation

1.  Build your ROS 2 package (which contains your URDF, world file, and launch file).
2.  Launch the simulation:
    ```bash
    ros2 launch YOUR_PACKAGE_NAME humanoid_gazebo.launch.py
    ```
    Gazebo should open, and you should see your simple humanoid torso model. Observe if it stands upright or falls over. If it falls, adjust the inertial properties or joint limits in your URDF.

This exercise provides a practical understanding of how URDF properties influence physical behavior in a simulated environment.
