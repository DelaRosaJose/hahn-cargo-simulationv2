# Project Setup Guide

## Prerequisites

Ensure that Docker is installed on your system. If it's not installed, you can download and install it from the [official Docker website](https://www.docker.com/).

## Getting Started

1. **Clone Project:**

    To clone the project, run the following command in your terminal or command prompt:
    
    ```bash
    git clone https://github.com/DelaRosaJose/hahn-cargo-simulationv2.git
    ```

1. **Navigate to Your Project Directory:**

   Open a terminal or command prompt and go to the root directory of your project where the `docker-compose.yml` file is located.

2. **Run Docker Compose:**

   Execute the following command to start your application using Docker Compose:

   ```bash
   docker-compose up -d
   ```
   
3. **Wait for Containers to Start:**

   Docker Compose will pull the necessary images and start the services defined in your docker-compose.yml. Monitor the progress using:

   ```bash
   docker-compose logs
   ```

## Accessing the application

   Once the containers are up and running, the application should be accessible. Visit the following URL: http://localhost:3000

## Stop and Clean Up

   When you're done testing, stop the containers:

```bash
docker-compose down
```
This command will stop and remove the containers, networks, and volumes created by Docker Compose.

