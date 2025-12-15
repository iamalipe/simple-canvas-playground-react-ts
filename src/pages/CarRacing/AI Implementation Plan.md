Plan: AI Self-Driving Car (Neuroevolution)
We will implement a Genetic Algorithm to evolve a neural network that learns to drive. This involves creating a population of cars, letting them drive, identifying the best ones, and mutating their "brains" for the next generation.

1. The "Brain" (Neural Network)
   Each car will have a simple Neural Network to make decisions.
   Inputs (Sensors): 5 "Raycasts" (Sensors) spreading out from the front of the car (e.g., -45°, -15°, 0°, +15°, +45°).
   Input Value: Distance to the track edge (normalized 0 to 1).
   Hidden Layer: 1 layer with ~6 neurons (Standard dense layer).
   Outputs: 2 values.
   Steering: -1 (Left) to +1 (Right).
   Throttle: 0 (Brake) to 1 (Full Speed).
2. Sensor System (Raycasting)
   The cars need to "see" the track.
   Math: We need a line-line intersection algorithm.
   Logic: Cast lines from the car's center based on its angle. Check where these lines intersect with the generated track borders (left and right rails).
   Visualization: We will draw these lines (green for clear, red for close collision) so you can see what the AI sees.
3. Genetic Algorithm (The Trainer)
   How the AI learns over time:
   Population: We spawn 50-100 cars at the start line simultaneously.
   Fitness Function: We measure how well a car did.
   Fitness = (Distance Traveled) + (Average Speed bonus)
   Distance is calculated by tracking which track segment index the car is closest to.
   Natural Selection:
   When all cars crash (or time runs out), the round ends.
   We pick the Top 10% of cars based on fitness.
   Mutation:
   We create the next generation (Generation N+1) by copying the brains of the Top 10%.
   We apply Mutation (randomly adjusting weights by small amounts) to these copies to explore new behaviors.
4. Code Architecture Changes
   We will need to refactor CarRacing.tsx significantly:
   New Classes/Interfaces
   NeuralNetwork: A minimal class for matrix multiplication and activation functions.
   Sensor: Handles raycasting math.
   Car: Now an object/class that holds its own Physics properties, Neural Network, and Sensor data.
   Logic Updates (CarRacingLogic)
   State: Change car (single object) to cars (array).
   Update Loop:
   Loop through all cars.
   If car.alive, get inputs from sensors -> feed to brain -> get outputs -> apply physics.
   Check for collisions. If collision, car.alive = false.
   Check if all cars are dead. If yes -> nextGeneration().
   Physics: Simplified collision detection for the population (maybe fewer precise checks for non-best cars to save performance).
5. UI Updates
   Mode Toggle: Switch between "Player Control" and "AI Training".
   Stats Panel:
   Generation Counter (Gen 1, Gen 2, etc.)
   Cars Alive (e.g., 4/50)
   Best Distance / Fitness.
   Visuals:
   Draw the "Best Car" opaque and colored (with sensors visible).
   Draw other cars semi-transparent (ghosts).
6. Phased Implementation
   Phase 1: Implement Raycasting/Sensors (visualize lines hitting walls).
   Phase 2: Implement the Neural Network class and connect it to Car controls (random movements).
   Phase 3: Implement the Genetic Algorithm (Population management, reset logic, mutation).
   Phase 4: UI controls to speed up simulation or save the best brain.
