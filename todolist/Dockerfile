# Use an official Python runtime as the base image
FROM python:3.12-alpine

# Set the working directory within the container
WORKDIR /usr/src/app

# Copy the dependencies file to the working directory
COPY requirements.txt ./

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# # Copy the rest of the application code to the working directory
# COPY . .

# Copy the Python files and SQLite database
COPY todolist.py todolist.db ./

# Copy the build folder from todolist-frontend
COPY todolist-frontend/build ./build

# Expose port 80 to the outside world - Optional
# EXPOSE 80

CMD ["python", "todolist.py"]