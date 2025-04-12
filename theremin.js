// Theremin Simulation - Advanced Implementation
// Web Audio API based theremin simulator with advanced sound options

// Main audio context and nodes
let audioContext;
let oscillator;
let gainNode;
let reverbNode;
let analyserNode;
let tremoloNode;
let distortionNode;
let tremoloOscillator;
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let isPlaying = false;
let currentPreset = "default";

// Audio parameters
const MIN_FREQUENCY = 65;
const MAX_FREQUENCY = 3000;
const TREMOLO_FREQUENCY = 10;

// Default settings
const defaultSettings = {
    waveform: 'sine',
    reverbEnabled: false,
    reverbAmount: 0.3,
    tremoloEnabled: false,
    tremoloSpeed: 5,
    tremoloDepth: 0.5,
    distortionEnabled: false,
    distortionAmount: 10,
    volumeSensitivity: 1
};

// Current settings (initialized with defaults)
let settings = {...defaultSettings};

// Initialize the application
window.addEventListener('load', init);

function init() {
    setupEventListeners();
    setupAudioContext();
    setupUI();
    loadPresets();
    showWelcomeScreen();
    setupKeyboardShortcuts();
}

// Set up event listeners for user interaction
function setupEventListeners() {
    const thereminArea = document.getElementById('theremin-area');
    
    // Mouse events
    thereminArea.addEventListener('mousedown', startSound);
    thereminArea.addEventListener('mousemove', updateSound);
    thereminArea.addEventListener('mouseup', stopSound);
    thereminArea.addEventListener('mouseleave', stopSound);
    
    // Touch events
    thereminArea.addEventListener('touchstart', handleTouchStart);
    thereminArea.addEventListener('touchmove', handleTouchMove);
    thereminArea.addEventListener('touchend', handleTouchEnd);
    
    // Control panel events
    document.getElementById('waveform-select').addEventListener('change', updateWaveform);
    document.getElementById('reverb-toggle').addEventListener('change', toggleReverb);
    document.getElementById('reverb-amount').addEventListener('input', updateReverbAmount);
    document.getElementById('tremolo-toggle').addEventListener('change', toggleTremolo);
    document.getElementById('tremolo-speed').addEventListener('input', updateTremoloSpeed);
    document.getElementById('tremolo-depth').addEventListener('input', updateTremoloDepth);
    document.getElementById('distortion-toggle').addEventListener('change', toggleDistortion);
    document.getElementById('distortion-amount').addEventListener('input', updateDistortionAmount);
    document.getElementById('volume-sensitivity').addEventListener('input', updateVolumeSensitivity);
    
    // Preset system events
    document.getElementById('save-preset').addEventListener('click', savePreset);
    document.getElementById('preset-select').addEventListener('change', loadPreset);
    
    // Recording events
    document.getElementById('record-button').addEventListener('click', toggleRecording);
    
    // Tutorial events
    document.getElementById('show-tutorial').addEventListener('click', showTutorial);
    document.getElementById('close-tutorial').addEventListener('click', closeTutorial);
    document.getElementById('close-welcome').addEventListener('click', closeWelcomeScreen);
}

// Set up the Web Audio API context and nodes
function setupAudioContext() {
    try {
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create audio nodes
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        analyserNode = audioContext.createAnalyser();
        
        // Configure analyser for visualizations
        analyserNode.fftSize = 2048;
        
        // Create and configure reverb
        reverbNode = createReverbNode();
        
        // Create tremolo effect
        tremoloNode = audioContext.createGain();
        tremoloOscillator = audioContext.createOscillator();
        tremoloOscillator.frequency.value = TREMOLO_FREQUENCY;
        
        // Create distortion effect
        distortionNode = audioContext.createWaveShaper();
        distortionNode.curve = makeDistortionCurve(settings.distortionAmount);
        distortionNode.oversample = '4x';
        
        // Set initial values
        oscillator.type = settings.waveform;
        oscillator.frequency.value = 0;
        gainNode.gain.value = 0;
        
        // Connect nodes based on initial settings
        connectAudioNodes();
        
        // Start oscillators but keep gain at 0
        oscillator.start();
        tremoloOscillator.start();
        
        // Start visualization
        setupVisualization();
        
    } catch (error) {
        console.error("Web Audio API error:", error);
        showError("Your browser doesn't support Web Audio API. Please try a modern browser like Chrome, Firefox, or Edge.");
    }
}

// Connect audio nodes based on current settings
function connectAudioNodes() {
    // Disconnect all nodes first
    oscillator.disconnect();
    gainNode.disconnect();
    tremoloNode.disconnect();
    distortionNode.disconnect();
    tremoloOscillator.disconnect();
    
    // Basic connection: oscillator -> gain -> destination
    oscillator.connect(gainNode);
    
    // Apply effects based on settings
    let lastNode = gainNode;
    
    // Apply distortion if enabled
    if (settings.distortionEnabled) {
        lastNode.connect(distortionNode);
        lastNode = distortionNode;
    }
    
    // Apply tremolo if enabled
    if (settings.tremoloEnabled) {
        lastNode.connect(tremoloNode);
        tremoloOscillator.connect(tremoloNode.gain);
        lastNode = tremoloNode;
    }
    
    // Apply reverb if enabled
    if (settings.reverbEnabled) {
        const dryGain = audioContext.createGain();
        const wetGain = audioContext.createGain();
        
        lastNode.connect(dryGain);
        lastNode.connect(reverbNode);
        reverbNode.connect(wetGain);
        
        dryGain.gain.value = 1 - settings.reverbAmount;
        wetGain.gain.value = settings.reverbAmount;
        
        dryGain.connect(analyserNode);
        wetGain.connect(analyserNode);
    } else {
        lastNode.connect(analyserNode);
    }
    
    // Connect to destination and analyzer
    analyserNode.connect(audioContext.destination);
}

// Create a simple reverb node
function createReverbNode() {
    const convolver = audioContext.createConvolver();
    
    // Create impulse response for reverb
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * 2; // 2 seconds
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
        const impulseData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
    }
    
    convolver.buffer = impulse;
    return convolver;
}

// Create distortion curve
function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; ++i) {
        const x = i * 2 / samples - 1;
        curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
}

// Start sound when user interacts with theremin area
function startSound(event) {
    event.preventDefault();
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    isPlaying = true;
    updateSound(event);
}

// Update sound based on cursor/touch position
function updateSound(event) {
    if (!isPlaying) return;
    
    const thereminArea = document.getElementById('theremin-area');
    const rect = thereminArea.getBoundingClientRect();
    
    // Get position (mouse or touch)
    let x, y;
    if (event.type.startsWith('touch')) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }
    
    // Normalize coordinates (0 to 1)
    const normalizedX = Math.max(0, Math.min(1, x / rect.width));
    const normalizedY = Math.max(0, Math.min(1, 1 - (y / rect.height)));
    
    // Map to frequency and volume
    const frequency = MIN_FREQUENCY + normalizedY * (MAX_FREQUENCY - MIN_FREQUENCY);
    const volume = normalizedX * settings.volumeSensitivity;
    
    // Update audio parameters with smoothing
    oscillator.frequency.setTargetAtTime(frequency, audioContext.currentTime, 0.01);
    gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);
    
    // Update UI displays
    updateFrequencyDisplay(frequency);
    updateVolumeDisplay(volume);
    updatePositionIndicator(normalizedX, normalizedY);
}

// Stop sound when user stops interaction
function stopSound() {
    if (!isPlaying) return;
    
    isPlaying = false;
    gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.02);
    updatePositionIndicator(null, null);
}

// Handle touch events
function handleTouchStart(event) {
    startSound(event);
}

function handleTouchMove(event) {
    updateSound(event);
}

function handleTouchEnd() {
    stopSound();
}

// Update UI displays
function updateFrequencyDisplay(frequency) {
    const display = document.getElementById('frequency-display');
    display.textContent = Math.round(frequency) + ' Hz';
}

function updateVolumeDisplay(volume) {
    const display = document.getElementById('volume-display');
    display.textContent = Math.round(volume * 100) + '%';
}

function updatePositionIndicator(x, y) {
    const indicator = document.getElementById('position-indicator');
    
    if (x === null || y === null) {
        indicator.style.display = 'none';
    } else {
        const thereminArea = document.getElementById('theremin-area');
        const rect = thereminArea.getBoundingClientRect();
        
        indicator.style.display = 'block';
        indicator.style.left = (x * rect.width) + 'px';
        indicator.style.top = ((1 - y) * rect.height) + 'px';
    }
}

// Set up UI elements
function setupUI() {
    // Set initial values for controls
    document.getElementById('waveform-select').value = settings.waveform;
    document.getElementById('reverb-toggle').checked = settings.reverbEnabled;
    document.getElementById('reverb-amount').value = settings.reverbAmount * 100;
    document.getElementById('tremolo-toggle').checked = settings.tremoloEnabled;
    document.getElementById('tremolo-speed').value = settings.tremoloSpeed;
    document.getElementById('tremolo-depth').value = settings.tremoloDepth * 100;
    document.getElementById('distortion-toggle').checked = settings.distortionEnabled;
    document.getElementById('distortion-amount').value = settings.distortionAmount;
    document.getElementById('volume-sensitivity').value = settings.volumeSensitivity * 100;
    
    // Update UI visibility based on settings
    updateEffectsVisibility();
}

// Update UI visibility based on settings
function updateEffectsVisibility() {
    document.getElementById('reverb-controls').style.display = 
        settings.reverbEnabled ? 'block' : 'none';
    document.getElementById('tremolo-controls').style.display = 
        settings.tremoloEnabled ? 'block' : 'none';
    document.getElementById('distortion-controls').style.display = 
        settings.distortionEnabled ? 'block' : 'none';
}

// Sound parameter update functions
function updateWaveform(event) {
    settings.waveform = event.target.value;
    oscillator.type = settings.waveform;
}

function toggleReverb(event) {
    settings.reverbEnabled = event.target.checked;
    connectAudioNodes();
    updateEffectsVisibility();
}

function updateReverbAmount(event) {
    settings.reverbAmount = event.target.value / 100;
    connectAudioNodes();
}

function toggleTremolo(event) {
    settings.tremoloEnabled = event.target.checked;
    connectAudioNodes();
    updateEffectsVisibility();
}

function updateTremoloSpeed(event) {
    settings.tremoloSpeed = parseFloat(event.target.value);
    tremoloOscillator.frequency.setValueAtTime(settings.tremoloSpeed, audioContext.currentTime);
}

function updateTremoloDepth(event) {
    settings.tremoloDepth = event.target.value / 100;
    // Tremolo depth is applied through the gain modulation
    tremoloOscillator.disconnect();
    tremoloOscillator.connect(tremoloNode.gain).gain.setValueAtTime(settings.tremoloDepth, audioContext.currentTime);
}

function toggleDistortion(event) {
    settings.distortionEnabled = event.target.checked;
    connectAudioNodes();
    updateEffectsVisibility();
}

function updateDistortionAmount(event) {
    settings.distortionAmount = parseInt(event.target.value);
    distortionNode.curve = makeDistortionCurve(settings.distortionAmount);
}

function updateVolumeSensitivity(event) {
    settings.volumeSensitivity = event.target.value / 100;
}

// Preset system functions
function savePreset() {
    const presetName = prompt("Enter a name for this preset:", "My Preset");
    
    if (!presetName) return;
    
    // Get all current presets
    let presets = JSON.parse(localStorage.getItem('thereminPresets') || '{}');
    
    // Add new preset
    presets[presetName] = {...settings};
    
    // Save to localStorage
    localStorage.setItem('thereminPresets', JSON.stringify(presets));
    
    // Update preset select dropdown
    updatePresetList(presetName);
}

function loadPresets() {
    const presets = JSON.parse(localStorage.getItem('thereminPresets') || '{}');
    
    // Always ensure default preset exists
    if (!presets['default']) {
        presets['default'] = {...defaultSettings};
        localStorage.setItem('thereminPresets', JSON.stringify(presets));
    }
    
    updatePresetList();
}

function updatePresetList(selectPreset = 'default') {
    const presets = JSON.parse(localStorage.getItem('thereminPresets') || '{}');
    const presetSelect = document.getElementById('preset-select');
    
    // Clear existing options
    presetSelect.innerHTML = '';
    
    // Add all presets
    Object.keys(presets).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        presetSelect.appendChild(option);
    });
    
    // Select the specified preset
    presetSelect.value = selectPreset;
    currentPreset = selectPreset;
}

function loadPreset(event) {
    const presetName = event.target.value;
    const presets = JSON.parse(localStorage.getItem('thereminPresets') || '{}');
    
    if (presets[presetName]) {
        // Apply preset settings
        settings = {...presets[presetName]};
        
        // Update UI
        setupUI();
        
        // Update audio nodes
        oscillator.type = settings.waveform;
        connectAudioNodes();
        
        currentPreset = presetName;
    }
}

// Audio visualization
function setupVisualization() {
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    // Visualization mode (0: waveform, 1: frequency)
    let visualizationMode = 0;
    
    // Toggle visualization mode on click
    canvas.addEventListener('click', () => {
        visualizationMode = (visualizationMode + 1) % 2;
    });
    
    function draw() {
        requestAnimationFrame(draw);
        
        if (visualizationMode === 0) {
            drawWaveform(canvasCtx, WIDTH, HEIGHT);
        } else {
            drawFrequency(canvasCtx, WIDTH, HEIGHT);
        }
    }
    
    draw();
}

function drawWaveform(canvasCtx, WIDTH, HEIGHT) {
    const bufferLength = analyserNode.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserNode.getByteTimeDomainData(dataArray);
    
    canvasCtx.fillStyle = 'rgb(20, 20, 30)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(100, 200, 255)';
    canvasCtx.beginPath();
    
    const sliceWidth = WIDTH / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;
        
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
}

function drawFrequency(canvasCtx, WIDTH, HEIGHT) {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserNode.getByteFrequencyData(dataArray);
    
    canvasCtx.fillStyle = 'rgb(20, 20, 30)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
    const barWidth = (WIDTH / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 255 * HEIGHT;
        
        const gradient = canvasCtx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight);
        gradient.addColorStop(0, 'rgb(0, 100, 200)');
        gradient.addColorStop(1, 'rgb(100, 200, 255)');
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
        if (x > WIDTH) break;
    }
}

// Recording functionality
function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    if (!audioContext) return;
    
    // Create a MediaStreamDestination node
    const destination = audioContext.createMediaStreamDestination();
    
    // Connect the analyser to the destination
    analyserNode.connect(destination);
    
    // Create a MediaRecorder
    mediaRecorder = new MediaRecorder(destination.stream);
    
    // Set up event handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = createDownloadLink;
    
    // Start recording
    recordedChunks = [];
    mediaRecorder.start();
    isRecording = true;
    
    // Update UI
    const recordButton = document.getElementById('record-button');
    recordButton.textContent = 'Stop Recording';
    recordButton.classList.add('recording');
}

function stopRecording() {
    if (!mediaRecorder) return;
    
    mediaRecorder.stop();
    isRecording = false;
    
    // Update UI
    const recordButton = document.getElementById('record-button');
    recordButton.textContent = 'Record Performance';
    recordButton.classList.remove('recording');
    
    // Disconnect the destination
    analyserNode.disconnect();
    connectAudioNodes(); // Reconnect the normal audio path
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function createDownloadLink() {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'theremin-performance.webm';
    downloadLink.textContent = 'Download Recording';
    downloadLink.className = 'download-link';
    
    const recordingsList = document.getElementById('recordings-list');
    const listItem = document.createElement('li');
    
    // Add play button
    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.className = 'play-button';
    playButton.onclick = () => {
        const audio = new Audio(url);
        audio.play();
    };
    
    listItem.appendChild(playButton);
    listItem.appendChild(downloadLink);
    recordingsList.appendChild(listItem);
}

// Tutorial and welcome screen
function showTutorial() {
    document.getElementById('tutorial-overlay').style.display = 'flex';
}

function closeTutorial() {
    document.getElementById('tutorial-overlay').style.display = 'none';
}

function showWelcomeScreen() {
    document.getElementById('welcome-screen').style.display = 'flex';
}

function closeWelcomeScreen() {
    document.getElementById('welcome-screen').style.display = 'none';
}

// Error handling
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Space bar to toggle tutorial
        if (event.code === 'Space' && !isPlaying) {
            event.preventDefault();
            const tutorial = document.getElementById('tutorial-overlay');
            if (tutorial.style.display === 'flex') {
                closeTutorial();
            } else {
                showTutorial();
            }
        }
        
        // R to toggle recording
        if (event.code === 'KeyR' && event.ctrlKey) {
            event.preventDefault();
            toggleRecording();
        }
        
        // S to save preset
        if (event.code === 'KeyS' && event.ctrlKey) {
            event.preventDefault();
            savePreset();
        }
        
        // 1-4 to change waveform
        if (event.code === 'Digit1') {
            document.getElementById('waveform-select').value = 'sine';
            updateWaveform({ target: { value: 'sine' } });
        } else if (event.code === 'Digit2') {
            document.getElementById('waveform-select').value = 'square';
            updateWaveform({ target: { value: 'square' } });
        } else if (event.code === 'Digit3') {
            document.getElementById('waveform-select').value = 'sawtooth';
            updateWaveform({ target: { value: 'sawtooth' } });
        } else if (event.code === 'Digit4') {
            document.getElementById('waveform-select').value = 'triangle';
            updateWaveform({ target: { value: 'triangle' } });
        }
    });
}

// Clean up resources when page is unloaded
window.addEventListener('beforeunload', () => {
    if (audioContext) {
        oscillator.stop();
        tremoloOscillator.stop();
        audioContext.close();
    }
});