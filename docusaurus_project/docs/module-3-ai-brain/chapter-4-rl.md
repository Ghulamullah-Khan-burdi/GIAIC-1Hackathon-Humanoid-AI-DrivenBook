# Chapter 4: RL & Imitation Learning (Optional Jetson)

Reinforcement Learning (RL) is a powerful paradigm where an agent learns to make decisions by interacting with an environment, receiving rewards or penalties for its actions. This is particularly appealing for robotics, as it allows robots to learn complex behaviors without explicit programming.

## Reinforcement Learning Basics

-   **Agent**: The robot or AI entity making decisions.
-   **Environment**: The world the agent interacts with (e.g., Isaac Sim).
-   **State**: The current situation of the environment.
-   **Action**: What the agent can do in a given state.
-   **Reward**: A signal from the environment indicating how good or bad an action was.
-   **Policy**: A strategy that maps states to actions, which the agent learns to optimize.

## Training AI Agents

In the context of Isaac Sim, you can train RL agents that control robot behaviors. Isaac Lab is specifically designed for high-speed RL training. The process typically involves:
1.  **Defining the Environment**: Setting up the physics, robot model, and reward functions in Isaac Sim.
2.  **Defining the Agent**: Specifying the observation space (what the agent "sees") and action space (what the agent can "do").
3.  **Choosing an Algorithm**: Using RL algorithms like PPO (Proximal Policy Optimization).
4.  **Training**: Running many simulations to allow the agent to learn.

---

## Exercise: Train a Simple Balancing Policy

Let's train a simple humanoid (or bipedal) robot to maintain balance. This exercise will conceptually demonstrate the RL training pipeline in Isaac Sim/Isaac Lab.

### Step 1: Set Up the Balancing Environment in Isaac Sim

1.  Launch Isaac Sim.
2.  Load a humanoid robot model (e.g., a simple bipedal robot) into a flat environment.
3.  Define the `reward_function` for balancing (e.g., higher reward for staying upright, penalty for falling).
4.  Define the `observation_space` (e.g., joint angles, angular velocities, IMU data) and `action_space` (e.g., joint torques or target positions).

### Step 2: Create a Training Script

NVIDIA Isaac Lab often provides ready-to-use environments and RL training frameworks. This script will conceptually outline the training process.

```python
# rl_balancing_trainer.py (conceptual script)
from omni.isaac.lab.envs import ManagerBasedRLEnv # Conceptual import
from omni.isaac.lab.utils.math import randomize_pose # Conceptual utility
import numpy as np
import time

class BalancingAgent:
    def __init__(self, env):
        self.env = env
        self.policy = None # Placeholder for learned policy

    def define_environment(self):
        # Conceptual setup of robot, reward, observation, action space
        print("Defining Isaac Lab environment for balancing...")
        self.observation_space = {"joint_pos": (12,), "joint_vel": (12,), "imu_data": (6,)}
        self.action_space = {"joint_torques": (12,)}
        self.reward_fn = lambda obs, act: 1.0 if np.all(obs["joint_pos"] < 0.1) else -1.0 # Simple conceptual reward
        print("Environment defined.")

    def train_policy(self, num_iterations=1000):
        print(f"Starting RL training for {num_iterations} iterations...")
        # In a real setup, this would run PPO or another RL algorithm
        for i in range(num_iterations):
            # Conceptual: agent interacts with env, collects data, updates policy
            if (i + 1) % 100 == 0:
                print(f"Iteration {i+1}/{num_iterations} - Average Reward: {np.random.rand()*10:.2f}")
        self.policy = "learned_balancing_policy"
        print("Training complete. Policy learned.")

    def deploy_policy(self):
        print("Deploying learned policy to robot...")
        # Conceptual: apply policy to robot in simulation
        for _ in range(10): # Simulate for a few steps
            # action = self.policy.compute_action(observation)
            # self.env.step(action)
            print("Robot balancing...")
            time.sleep(0.5)
        print("Policy deployed and robot is balancing.")


def main():
    # Assume env is initialized by Isaac Lab/Sim
    env = {} # Placeholder for the environment object
    agent = BalancingAgent(env)
    
    agent.define_environment()
    agent.train_policy(num_iterations=500)
    agent.deploy_policy()

if __name__ == "__main__":
    main()
```

### Step 3: Run the Training and Deployment

1.  Ensure your Isaac Sim/Isaac Lab environment is correctly set up.
2.  Run your Python training script.
    ```bash
    python rl_balancing_trainer.py
    ```
    Observe the training progress and then the robot executing the learned balancing policy. This exercise provides an insight into how RL is used to enable robots to learn complex dynamic behaviors.
