# Chapter 2: Building a Basic Robot (URDF)

To create a digital twin, we first need a model of our robot. The Unified Robot Description Format (URDF) is an XML format for describing all aspects of a robot, including its visual appearance, collision properties, and physical characteristics.

## URDF/Xacro

-   **URDF**: Describes the robot as a collection of `links` (rigid bodies) and `joints` (connections between links).
-   **Xacro (XML Macros)**: An XML macro language that allows for more concise and reusable URDF files. It's highly recommended for complex robots to avoid repetition.

## Links & Joints

-   **Link**: A rigid body of the robot. It has properties like mass, inertia, visual shape, and collision geometry.
-   **Joint**: Defines how two links are connected and how they can move relative to each other (e.g., `revolute` for rotation, `prismatic` for linear movement, `fixed` for no movement).

## Inertial Properties

Each link needs `inertial` properties (mass, center of mass, inertia tensor) for accurate physics simulation. These define how the link responds to forces and torques.

## Sensors in URDF

While some sensors are modeled externally (e.g., Gazebo plugins), their presence can be indicated in the URDF, and their frames defined relative to a link.

---

## Exercise: Build a Simple Humanoid Torso

Let's create a basic URDF model for a simple humanoid torso. This will demonstrate the core concepts of links and joints.

### Step 1: Create Your URDF File

Create a file named `simple_torso.urdf` in your `docs/module-2-digital-twin/examples/simple_humanoid_urdf/` directory.

```xml
<?xml version="1.0"?>
<robot name="simple_humanoid_torso">

  <!-- Base Link (Immovable) -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.2 0.4 0.6"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.2 0.4 0.6"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <mass value="10.0"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
  </link>

  <!-- Head Link -->
  <link name="head_link">
    <visual>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
      <material name="red">
        <color rgba="1 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <mass value="2.0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting base_link to head_link -->
  <joint name="head_joint" type="revolute">
    <parent link="base_link"/>
    <child link="head_link"/>
    <origin xyz="0 0 0.4" rpy="0 0 0"/> <!-- Position relative to parent -->
    <axis xyz="0 0 1"/> <!-- Rotation around Z-axis -->
    <limit lower="-1.57" upper="1.57" effort="10.0" velocity="1.0"/>
  </joint>

</robot>
```

### Step 2: Validate Your URDF

Use the `check_urdf` tool (part of ROS 2 installation) to validate your file:
```bash
check_urdf simple_torso.urdf
```
If there are no errors, your URDF is valid! You can also view it using `urdf_to_graphiz` or `rviz`.

This torso model provides a foundation for more complex humanoid robot designs.
