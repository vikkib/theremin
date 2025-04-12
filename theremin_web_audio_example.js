/**
 * Theremin Web Audio API Implementation Example
 * 
 * This code demonstrates a basic theremin-like instrument using Web Audio API.
 * It maps mouse position to frequency and volume parameters.
 */

// Initialize the audio context
let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;

// Frequency range (in Hz)
const MIN_FREQUENCY = 65;   // Approximate lower bound of theremin range
const MAX_FREQUENCY = 3000; // Approximate upper bound of theremin range

// Volume range
const MIN_VOLUME = 0;
const MAX_VOLUME = 1;

// Initialize the theremin
function initTheremin() {
  // Create audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillator
  oscillator = audioContext.createOscillator();
  oscillator.type = 'sine'; // Sine wave is closest to theremin's pure tone
  oscillator.frequency.value = 440; // Default to A4
  
  // Create gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.gain.value = 0; // Start with no sound
  
  // Connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start the oscillator
  oscillator.start();
  isPlaying = true;
  
  console.log("Theremin initialized");
}

// Update theremin parameters based on mouse position
function updateTheremin(event) {
  if (!isPlaying) return;
  
  // Map vertical mouse position (Y-axis) to frequency
  // Invert Y-axis so higher position = higher pitch
  const height = window.innerHeight;
  const normalizedY = 1 - (event.clientY / height);
  const frequency = MIN_FREQUENCY + normalizedY * (MAX_FREQUENCY - MIN_FREQUENCY);
  
  // Map horizontal mouse position (X-axis) to volume
  const width = window.innerWidth;
  const normalizedX = event.clientX / width;
  const volume = MIN_VOLUME + normalizedX * (MAX_VOLUME - MIN_VOLUME);
  
  // Apply the values with smoothing for more theremin-like effect
  oscillator.frequency.setTargetAtTime(frequency, audioContext.currentTime, 0.01);
  gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);
  
  // Optional: Update UI to show current frequency and volume
  updateUI(frequency, volume);
}

// Stop the theremin
function stopTheremin() {
  if (!isPlaying) return;
  
  // Fade out to avoid clicks
  gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.02);
  
  // Stop the oscillator after fade out
  setTimeout(() => {
    oscillator.stop();
    isPlaying = false;
    console.log("Theremin stopped");
  }, 100);
}

// Optional: Update UI with current values
function updateUI(frequency, volume) {
  console.log(`Frequency: ${frequency.toFixed(2)} Hz, Volume: ${volume.toFixed(2)}`);
  // In a real implementation, you might update DOM elements here
}

// Example of how to use these functions in a web page:
/*
document.addEventListener('DOMContentLoaded', () => {
  const thereminArea = document.getElementById('theremin-area');
  
  // Start theremin when mouse enters the area
  thereminArea.addEventListener('mouseenter', () => {
    if (!isPlaying) {
      initTheremin();
    }
  });
  
  // Update theremin parameters as mouse moves
  thereminArea.addEventListener('mousemove', updateTheremin);
  
  // Stop theremin when mouse leaves the area
  thereminArea.addEventListener('mouseleave', stopTheremin);
});
*/