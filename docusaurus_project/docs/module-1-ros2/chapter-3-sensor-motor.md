# Chapter 3: Robot Sensors & Motor Control Pipelines

Robots interact with the world through sensors and act upon it using motors. In this chapter, we'll explore how common robotic sensors like cameras, IMUs (Inertial Measurement Units), and Lidars send their data into ROS topics, and how we can use this data to control motors.

## Camera, IMU, Lidar Basics

-   **Camera**: Provides visual information, similar to human eyes. Data often comes as image streams.
-   **IMU (Inertial Measurement Unit)**: Measures orientation, angular velocity, and linear acceleration. Crucial for understanding a robot's pose and movement.
-   **Lidar (Light Detection and Ranging)**: Uses laser pulses to measure distances to objects, creating 2D or 3D maps of the environment.

## How Sensors Send Data into ROS Topics

Each sensor typically has a driver (a ROS node) that reads data from the hardware and publishes it to specific ROS topics. For instance:
-   A camera node might publish `sensor_msgs/Image` messages to `/camera/image_raw`.
-   An IMU node might publish `sensor_msgs/Imu` messages to `/imu/data`.
-   A Lidar node might publish `sensor_msgs/LaserScan` messages to `/scan`.

## Controlling Motors Using ROS

Motor control involves sending commands (often velocity or position targets) to motor controller nodes, which then translate these into signals for the physical motors. This data is also typically communicated via ROS topics.

For example, a `/cmd_vel` topic, accepting `geometry_msgs/Twist` messages, is a common way to control the linear and angular velocity of a mobile robot.

---

## Exercise: Simulate a Simple IMU-Controlled Robot

Let's imagine a simple balancing robot. When its IMU detects a tilt, it should activate motors to correct its posture. We'll simulate this data flow.

### Step 1: Create a Dummy IMU Publisher

Create a Python node that publishes dummy `sensor_msgs/Imu` messages (you'll need to define a simple `Imu` message type or use `std_msgs/Float64` for simplicity) to a `/imu_data` topic. Simulate a slight tilt.

```python
# imu_publisher.py (simplified)
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64 # Using Float64 for simplified IMU tilt

class IMUPublisher(Node):
    def __init__(self):
        super().__init__('imu_publisher')
        self.publisher_ = self.create_publisher(Float64, 'imu_data', 10)
        self.timer = self.create_timer(0.5, self.timer_callback) # Publish every 0.5 sec
        self.tilt_value = 0.1 # Simulate a slight tilt

    def timer_callback(self):
        msg = Float64()
        msg.data = self.tilt_value
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing IMU tilt: {msg.data}')

def main(args=None):
    rclpy.init(args=args)
    imu_publisher = IMUPublisher()
    rclpy.spin(imu_publisher)
    imu_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Step 2: Create a Motor Controller Node

Create a Python node that subscribes to `/imu_data`. If the tilt exceeds a certain threshold, it should publish a correction command (e.g., a simple string like "forward" or "backward") to a `/motor_command` topic.

```python
# motor_controller.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64, String # For IMU tilt and motor command

class MotorController(Node):
    def __init__(self):
        super().__init__('motor_controller')
        self.subscription = self.create_subscription(
            Float64,
            'imu_data',
            self.imu_callback,
            10)
        self.publisher_ = self.create_publisher(String, 'motor_command', 10)
        self.tilt_threshold = 0.05 # degrees or radians

    def imu_callback(self, msg):
        current_tilt = msg.data
        motor_command = String()
        if current_tilt > self.tilt_threshold:
            motor_command.data = "CORRECT_BACKWARD"
            self.get_logger().info("Tilt detected! Sending: CORRECT_BACKWARD")
        elif current_tilt < -self.tilt_threshold:
            motor_command.data = "CORRECT_FORWARD"
            self.get_logger().info("Tilt detected! Sending: CORRECT_FORWARD")
        else:
            motor_command.data = "STOP"
            self.get_logger().info("No significant tilt. Sending: STOP")
        self.publisher_.publish(motor_command)

def main(args=None):
    rclpy.init(args=args)
    motor_controller = MotorController()
    rclpy.spin(motor_controller)
    motor_controller.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Step 3: Run the Simulation

Open two terminal windows:
1.  Run the `imu_publisher.py` node.
2.  Run the `motor_controller.py` node.

Observe how the `motor_controller` reacts to the simulated IMU data. This demonstrates a basic closed-loop control system.
