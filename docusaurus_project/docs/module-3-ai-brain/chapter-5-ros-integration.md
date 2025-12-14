# Chapter 5: Integrating Isaac with ROS

NVIDIA Isaac Sim is a powerful platform for AI-driven robotics. However, the broader robotics community heavily relies on ROS 2 for its modularity, extensive tools, and standardized communication protocols. Integrating Isaac Sim with ROS 2 allows you to combine the strengths of both ecosystems: Isaac Sim's advanced simulation and AI capabilities with ROS 2's flexible architecture and rich set of packages.

## ROS–Isaac Bridge

The ROS–Isaac bridge is a set of tools and packages that facilitate communication between Isaac Sim and ROS 2. It typically involves:
-   **ROS 2 Nodes within Isaac Sim**: Isaac Sim can run ROS 2 nodes directly, allowing it to publish sensor data, subscribe to control commands, and interact with the ROS graph.
-   **Message Translation**: Converting data formats between Isaac Sim's internal representation and ROS 2 message types.
-   **ROS 2 Launch System Integration**: Launching Isaac Sim scenes and ROS 2 nodes together using the ROS 2 launch system.

This integration enables you to use ROS 2 packages (like Nav2 for navigation, MoveIt 2 for manipulation, or custom control nodes) to command robots simulated in Isaac Sim.

## Sending Commands from Isaac to Real Robots

The integration doesn't stop at simulation. By using the ROS–Isaac bridge, the same ROS 2 control nodes that you use for your simulated robot in Isaac Sim can often be deployed to control a real physical robot that also communicates via ROS 2. This "sim-to-real" transfer is a significant advantage of this integrated approach.

---

## Exercise: Sync Isaac Sim with ROS Navigation

Let's demonstrate a basic integration where a navigation goal is sent from a standard ROS 2 node, and the robot in Isaac Sim executes that navigation.

### Step 1: Set Up an Isaac Sim Scene with a Navigable Robot

1.  Launch Isaac Sim.
2.  Load a robot model that is configured for navigation (e.g., has a differential drive base, Lidar sensor, and is compatible with Nav2).
3.  Set up a simple navigable environment within Isaac Sim.
4.  Ensure the robot in Isaac Sim is running ROS 2 nodes to expose its Lidar data, odometry, and accept navigation commands (e.g., `cmd_vel`).

### Step 2: Create a Simple ROS 2 Navigation Goal Publisher

Create a Python ROS 2 node that publishes a simple `geometry_msgs/PoseStamped` message to the `/goal_pose` topic (a common topic for navigation goals in Nav2).

```python
# ros_navigation_goal_publisher.py
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped
from nav2_simple_commander.robot_navigator import BasicNavigator # Requires nav2_simple_commander

class NavigationGoalPublisher(Node):

    def __init__(self):
        super().__init__('navigation_goal_publisher')
        self.publisher_ = self.create_publisher(PoseStamped, '/goal_pose', 10)
        self.timer = self.create_timer(1.0, self.timer_callback) # Publish once after 1 second
        self.goal_sent = False

    def timer_callback(self):
        if not self.goal_sent:
            self.get_logger().info('Publishing navigation goal...')
            goal_pose = PoseStamped()
            goal_pose.header.frame_id = 'map'
            goal_pose.header.stamp = self.get_clock().now().to_msg()
            goal_pose.pose.position.x = 2.0  # Go to x=2.0, y=0.0
            goal_pose.pose.position.y = 0.0
            goal_pose.pose.orientation.w = 1.0 # No rotation
            self.publisher_.publish(goal_pose)
            self.goal_sent = True
            self.get_logger().info('Navigation goal published.')
            # After publishing the goal, you might want to stop the timer
            self.timer.cancel()

def main(args=None):
    rclpy.init(args=args)
    navigator = BasicNavigator() # Initialize Nav2 BasicNavigator
    navigator.waitUntilNav2Active() # Wait for Nav2 to be active

    goal_pose = PoseStamped()
    goal_pose.header.frame_id = 'map'
    goal_pose.header.stamp = navigator.get_clock().now().to_msg()
    goal_pose.pose.position.x = 2.0
    goal_pose.pose.position.y = 0.0
    goal_pose.pose.orientation.w = 1.0
    
    navigator.goToPose(goal_pose) # Send the goal using BasicNavigator
    
    i = 0
    while not navigator.isTaskComplete():
        i += 1
        feedback = navigator.getFeedback()
        if feedback and i % 5 == 0:
            print(f'Distance remaining: {feedback.distance_remaining:.2f} meters.')
    
    result = navigator.getResult()
    if result == BasicNavigator.TaskResult.SUCCEEDED:
        print('Goal succeeded!')
    elif result == BasicNavigator.TaskResult.CANCELED:
        print('Goal was canceled!')
    elif result == BasicNavigator.TaskResult.FAILED:
        print('Goal failed!')
    else:
        print('Goal has an invalid return status!')

    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Step 3: Run the Integrated System

1.  Launch Isaac Sim with your navigable robot and environment. Ensure the ROS 2 bridge and relevant Nav2 nodes within Isaac Sim are active.
2.  In a separate terminal, source your ROS 2 environment and run your `ros_navigation_goal_publisher.py` node.
    ```bash
    ros2 run YOUR_PACKAGE_NAME ros_navigation_goal_publisher
    ```
    Observe the robot in Isaac Sim navigating to the specified goal. This exercise demonstrates how Isaac Sim can serve as a high-fidelity simulation backend for standard ROS 2 navigation stacks.
