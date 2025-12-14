# Chapter 1: What is ROS 2 & Why It Matters?

Welcome to the world of humanoid robotics! In this first module, we'll build the "nervous system" for our robot using the Robot Operating System (ROS 2).

## Overview of Robotic Communication

Imagine building a robot. You have sensors (eyes, ears), motors (muscles), and a computer (the brain). How do they all talk to each other? In the past, every robotics company built its own communication system from scratch. This was time-consuming and made it hard to share code.

ROS provides a standardized way for different parts of a robot to communicate. It's like a universal language for robots.

## ROS 1 vs. ROS 2

ROS 1 was a huge success, but it had some limitations, especially for commercial and mission-critical applications. ROS 2 was redesigned from the ground up to be more reliable, secure, and ready for production.

Key improvements in ROS 2:
- **Real-time support**: Better for robots that need to react quickly.
- **Multi-robot systems**: Designed to work with teams of robots.
- **Improved security**: Built-in security features.

## How Humanoid Robots Use ROS 2

In a humanoid robot, ROS 2 is used to:
- **Read sensor data**: Get information from cameras, IMUs, and other sensors.
- **Control motors**: Send commands to the robot's joints to make it move.
- **Plan actions**: Decide what to do next based on sensor data and goals.

This is all done through a network of **nodes**, which are like small programs that do one thing well. They communicate with each other by sending messages on **topics**.

---

## Exercise: Install ROS 2 + Run Turtlesim

Let's get our hands dirty! This exercise will guide you through installing ROS 2 and running a simple simulation to make sure everything is working.

### Step 1: Install ROS 2 Humble

We will be using ROS 2 Humble Hawksbill, which is the latest long-term support (LTS) release. Follow the official installation guide for your operating system (Ubuntu 22.04 is recommended):

[ROS 2 Humble Installation Guide](https://docs.ros.org/en/humble/Installation.html)

### Step 2: Run Turtlesim

Turtlesim is a simple and fun way to test your ROS 2 installation. Open two terminal windows.

**In the first terminal, run:**
```bash
source /opt/ros/humble/setup.bash
ros2 run turtlesim turtlesim_node
```
You should see a window appear with a turtle in the middle.

**In the second terminal, run:**
```bash
source /opt/ros/humble/setup.bash
ros2 run turtlesim turtle_teleop_key
```
Now, you can use the arrow keys on your keyboard to move the turtle around in the simulation window.

### Verification

If you can see the turtlesim window and move the turtle with your arrow keys, you have successfully installed ROS 2! Congratulations, you're ready to start building your own robotic nervous system.
