# Chapter 5: Creating a Full Digital Twin

Building on the previous chapters, we will now integrate all the components to create a complete digital twin. This involves combining a detailed robot model, a realistic environment, and interactive objects to simulate complex scenarios.

## Visual vs. Physical Model

In advanced simulations, you might have separate models for visual representation and physical interactions:
-   **Visual Model**: High-fidelity meshes for realistic rendering (used by Unity).
-   **Physical Model**: Simplified collision geometries and accurate inertial properties for efficient physics computation (used by Gazebo).

URDF allows you to specify both `visual` and `collision` elements separately within a `link`, enabling this distinction.

## Adding Environments

A digital twin is more than just a robot; it's a robot in an environment. You can define environments in Gazebo using SDF (Simulation Description Format) world files, which can include:
-   Ground planes and terrains.
-   Static objects (e.g., walls, furniture).
-   Lights and sensors within the environment.

Similarly, in Unity, you can design detailed 3D scenes with various assets to create immersive environments for your robot.

## Interacting with Objects

For a humanoid robot, interacting with objects (e.g., picking up a cup, opening a door) is a key capability. In simulation, this involves:
-   **Object Models**: Defining the physical and visual properties of objects.
-   **Robot End-Effectors**: Designing grippers or hands for the robot.
-   **Collision Detection**: Ensuring the robot interacts realistically with objects.
-   **Control Algorithms**: Developing strategies for grasping and manipulating objects.

---

## Exercise: Create a Room and Interact with Objects

Let's create a simple room environment and have our humanoid robot interact with a basic object like a cube.

### Step 1: Design a Simple Room in SDF (Gazebo)

Create an SDF world file (e.g., `room_with_cube.sdf`) that defines a room with walls, a floor, and a movable cube. Place this in `docs/module-2-digital-twin/examples/full_digital_twin/`.

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="full_digital_twin_world">
    <include>
      <uri>model://sun</uri>
    </include>
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Simple Room Walls -->
    <model name="wall_1">
      <pose>0 2.5 1.25 0 0 0</pose>
      <link name="link">
        <visual><geometry><box>10 0.1 2.5</box></geometry></visual>
        <collision><geometry><box>10 0.1 2.5</box></geometry></collision>
      </link>
    </model>
    <!-- Add more walls as needed for a full room -->

    <!-- Movable Cube -->
    <model name="red_cube">
      <pose>1 0 0.5 0 0 0</pose>
      <link name="link">
        <visual>
          <geometry><box>0.2 0.2 0.2</box></geometry>
          <material><script><uri>file://media/materials/scripts/gazebo.material</uri><name>Gazebo/Red</name></script></material>
        </visual>
        <collision><geometry><box>0.2 0.2 0.2</box></geometry></collision>
        <inertial>
          <mass>0.5</mass>
          <inertia ixx="0.001" ixy="0" ixz="0" iyy="0.001" iyz="0" izz="0.001"/>
        </inertial>
      </link>
    </model>

  </world>
</sdf>
```

### Step 2: Update Your Robot Model (Optional: Add a Simple Gripper)

If your humanoid model from Chapter 2 is too simple, you might want to extend its URDF to include a very basic gripper or hand model. For this exercise, assume the robot can "touch" the cube.

### Step 3: Launch Robot in Room

Use a modified launch file (similar to Chapter 3) to:
1.  Launch Gazebo with your `room_with_cube.sdf` world.
2.  Spawn your humanoid robot (e.g., `simple_torso.urdf`) inside the room.
3.  Manually (or programmatically, if you extend your controller) move the robot to "touch" the cube.

This comprehensive exercise showcases the potential of digital twins for simulating complex robot-environment interactions.
