# Chapter 4: ROS 2 Actions & Navigation Basics

While topics and services are great for continuous data streams and immediate request/response patterns, some tasks are long-running and require active feedback and the ability to cancel. This is where ROS 2 **Actions** come in. Actions are especially important for navigation and complex manipulations in humanoid robots.

## What Actions Are

An action is a communication mechanism built on top of topics and services. It consists of three parts:
-   **Goal**: The desired state or target for the action (e.g., "go to X, Y coordinates").
-   **Feedback**: Continuous updates on the progress of the action (e.g., "robot is at X', Y'").
-   **Result**: The outcome of the action once it's complete (e.g., "reached destination successfully").

Actions use a client-server model. An **Action Client** sends a goal to an **Action Server**, which then executes the task, provides feedback, and eventually sends a result.

## Navigation Pipeline

The navigation stack in ROS 2 heavily relies on actions. When you tell a robot to "go to the kitchen," that's an action goal. The navigation system provides feedback as the robot moves and a final result (success or failure) when it reaches the destination.

## `move_base` Concepts (or equivalent in ROS 2 Nav2)

In ROS 1, `move_base` was the primary navigation package. In ROS 2, this functionality is provided by the Nav2 (Navigation2) stack, which uses a modular action-based approach. The core idea remains: an action client sends a goal, and a series of nodes (e.g., path planners, local controllers, costmaps) work together to move the robot safely to its destination.

---

## Exercise: Send a Robot Point-to-Point Commands

For this exercise, we will simulate sending a navigation goal to a hypothetical robot. We'll create an action client that sends a goal, and we'll conceptualize the action server as an external system (like Nav2) that processes it.

### Step 1: Define a Simple Navigation Action

Since we're simulating, let's assume a simple action definition where the goal is a target `x, y` coordinate. In a real scenario, you would use existing ROS 2 action types (like `NavigateToPose`).

### Step 2: Create a Simple Action Client

This Python node will act as an action client. It will send a goal (e.g., `x=5.0, y=3.0`) to a `navigate_to_pose` action server and print feedback/results.

```python
# simple_navigation_action_client.py
import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node
from action_msgs.msg import GoalStatus # For status codes

# In a real scenario, you'd import a custom action message, e.g.,
# from my_robot_actions.action import NavigateToPose

# For this example, let's define a simple action concept for demonstration
class NavigateToPoseAction:
    # Dummy structure to represent the action definition
    class Goal:
        def __init__(self, x=0.0, y=0.0):
            self.x = x
            self.y = y

    class Result:
        def __init__(self, success=False):
            self.success = success
    
    class Feedback:
        def __init__(self, current_x=0.0, current_y=0.0, distance_left=0.0):
            self.current_x = current_x
            self.current_y = current_y
            self.distance_left = distance_left


class SimpleNavigationActionClient(Node):

    def __init__(self):
        super().__init__('simple_navigation_action_client')
        self._action_client = ActionClient(
            self,
            NavigateToPoseAction, # Use our dummy action here
            'navigate_to_pose')

    def send_goal(self, x, y):
        goal_msg = NavigateToPoseAction.Goal(x=x, y=y) # Create a goal instance

        self._action_client.wait_for_server()

        self.get_logger().info('Sending goal request...')

        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback)

        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected :(')
            return

        self.get_logger().info('Goal accepted :)')

        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def get_result_callback(self, future):
        result = future.result().result
        status = future.result().status
        if status == GoalStatus.STATUS_SUCCEEDED:
            self.get_logger().info(f'Goal succeeded! Result: {result.success}')
        else:
            self.get_logger().info(f'Goal failed with status: {status}')
        rclpy.shutdown()

    def feedback_callback(self, feedback_msg):
        feedback = feedback_msg.feedback
        self.get_logger().info(f'Received feedback: Current position ({feedback.current_x:.2f}, {feedback.current_y:.2f}), Distance left: {feedback.distance_left:.2f}')


def main(args=None):
    rclpy.init(args=args)
    action_client = SimpleNavigationActionClient()
    action_client.send_goal(5.0, 3.0) # Send a goal to X=5.0, Y=3.0
    rclpy.spin(action_client)


if __name__ == '__main__':
    main()
```

### Step 3: Run the Action Client

This exercise assumes an `navigate_to_pose` action server is running (e.g., from a simulated robot with Nav2). You would run your action client, and observe its logs.

```bash
# First, ensure your ROS 2 environment is sourced
source /opt/ros/humble/setup.bash

# Run your action client (assuming you have a package that includes simple_navigation_action_client.py)
ros2 run <your_package_name> simple_navigation_action_client
```
The client will send a goal, and if an action server were active, it would provide feedback and eventually a result.
