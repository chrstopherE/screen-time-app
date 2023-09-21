let isTrackingPaused = false;  // Flag to track if tracking is paused

// Function to pause WebGazer tracking
function pauseTracking() {
  if (!isTrackingPaused) {
    webgazer.pause();
    isTrackingPaused = true;
    console.log('WebGazer tracking paused.');
  }
}

// Function to resume WebGazer tracking
function resumeTracking() {
  if (isTrackingPaused) {
    webgazer.resume();
    isTrackingPaused = false;
    console.log('WebGazer tracking resumed.');
  }
}

// Example: Check if the box is black (replace with your actual condition)
function isBoxBlack() {
  // Replace this with your logic to determine if the box is black
  // For demonstration purposes, we'll use a simple condition
  // Assume the box is black if its background color is black
  const boxColor = window.getComputedStyle(document.getElementById('yourBoxId')).backgroundColor;
  return boxColor === 'rgb(0, 0, 0)';
}

// Periodically check the box color and pause/resume tracking accordingly
const checkBoxColorInterval = 1000;  // Check every 1 second

setInterval(() => {
  if (isBoxBlack()) {
    pauseTracking();
  } else {
    resumeTracking();
  }
}, checkBoxColorInterval);

// Begin WebGazer
webgazer.begin();
