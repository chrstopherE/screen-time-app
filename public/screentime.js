let counter = 0;
let previousX = 0;
let previousY = 0;
const smoothingFactor = 0.5;

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updatePositionDisplay(prediction) {
    if (prediction) {
        const rawX = prediction.x.toFixed(2);
        const rawY = prediction.y.toFixed(2);

        const x = previousX + smoothingFactor * (rawX - previousX);
        const y = previousY + smoothingFactor * (rawY - previousY);

        document.getElementById('positionDisplay').innerText = `Position: (${x.toFixed(2)}, ${y.toFixed(2)})`;

        // Update the counter and display as time stamp
        counter++;
        const timeString = formatTime(counter);
        document.getElementById('counterDisplay').innerText = 'Screen Time: ' + timeString;

        previousX = x;
        previousY = y;
    }
}

// Set up a listener for the webgazer callback
webgazer.setGazeListener(function(data, elapsedTime) {
    if (data && data.x !== null && data.y !== null) {
        updatePositionDisplay(data);
    }
});