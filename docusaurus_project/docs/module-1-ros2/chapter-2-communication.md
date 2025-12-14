# Chapter 2: Nodes, Topics, Services, & Parameters

In ROS 2, the core components of any robot application are `nodes`, which communicate with each other using `topics`, `services`, and `parameters`. Understanding these concepts is fundamental to building complex robotic systems.

## The ROS Graph

The ROS graph is a network of ROS 2 elements processing data. It consists of:
- **Nodes**: Executable processes that perform computation. Each node should have a single, well-defined purpose.
- **Topics**: A named bus over which nodes exchange messages. Publishers send data to topics, and subscribers receive data from topics.
- **Services**: A request/response communication mechanism for client-server interactions. A client sends a request and waits for a response from a service server.
- **Parameters**: Dynamic, configurable values that nodes can load at startup or change during runtime.

## Writing Your First Publisher/Subscriber

Let's create a simple publisher and subscriber pair to see how nodes communicate using topics.

### Example: Simple String Publisher

This node will publish a "Hello ROS!" message to the `/chatter` topic every second.

```python
# simple_publisher.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class SimplePublisher(Node):

    def __init__(self):
        super().__init__('simple_publisher')
        self.publisher_ = self.create_publisher(String, 'chatter', 10)
        timer_period = 1.0  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello ROS! %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    simple_publisher = SimplePublisher()
    rclpy.spin(simple_publisher)
    simple_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Example: Simple String Subscriber

This node will subscribe to the `/chatter` topic and print any messages it receives.

```python
# simple_subscriber.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class SimpleSubscriber(Node):

    def __init__(self):
        super().__init__('simple_subscriber')
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)

def main(args=None):
    rclpy.init(args=args)
    simple_subscriber = SimpleSubscriber()
    rclpy.spin(simple_subscriber)
    simple_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

---

## Parameters for Robot Control

Parameters are used to configure nodes. For example, a robot's motor controller node might have parameters for maximum speed or acceleration. These can be set from the command line or dynamically changed during runtime.

## Exercise: Build a Simple Sensor → Controller → Motor Pipeline

This exercise combines topics and (conceptually) parameters to simulate a basic robotic pipeline. We won't build physical hardware here, but imagine the data flow.

1.  **Create a ROS 2 Package**:
    ```bash
    cd <your_ros2_workspace>/src
    ros2 pkg create --build-type ament_python my_robot_pipeline
    ```
2.  **Add Publisher (Sensor Node)**:
    Create a Python node that publishes dummy sensor data (e.g., random numbers simulating IMU readings) to a topic like `/sensor_data`.
3.  **Add Subscriber/Publisher (Controller Node)**:
    Create a Python node that subscribes to `/sensor_data`. In its callback, process the data (e.g., if sensor_data > threshold, publish 'forward' command). Publish control commands to a topic like `/motor_commands`.
4.  **Add Subscriber (Motor Node)**:
    Create a Python node that subscribes to `/motor_commands` and simply prints the received command, simulating a motor executing the command.
5.  **Run Your Pipeline**:
    Open three terminals, source your ROS 2 environment, and run each of your three nodes. Observe the data flow.
