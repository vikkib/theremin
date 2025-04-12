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
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    
    // Mouse events
    thereminArea.addEventListener('mousedown', startSound);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    thereminArea.addEventListener('mousemove', updateSound);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    thereminArea.addEventListener('mouseup', stopSound);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    thereminArea.addEventListener('mouseleave', stopSound);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    
    // Touch events
    thereminArea.addEventListener('touchstart', handleTouchStart);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    thereminArea.addEventListener('touchmove', handleTouchMove);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    thereminArea.addEventListener('touchend', handleTouchEnd);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    
    // Control panel events
    const waveform_select = document.getElementById('waveform-select');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (waveform_select) {
        waveform_select.addEventListener('change', updateWaveform);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const reverb_toggle = document.getElementById('reverb-toggle');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (reverb_toggle) {
        reverb_toggle.addEventListener('change', toggleReverb);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const reverb_amount = document.getElementById('reverb-amount');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (reverb_amount) {
        reverb_amount.addEventListener('input', updateReverbAmount);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const tremolo_toggle = document.getElementById('tremolo-toggle');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (tremolo_toggle) {
        tremolo_toggle.addEventListener('change', toggleTremolo);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const tremolo_speed = document.getElementById('tremolo-speed');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (tremolo_speed) {
        tremolo_speed.addEventListener('input', updateTremoloSpeed);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const tremolo_depth = document.getElementById('tremolo-depth');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (tremolo_depth) {
        tremolo_depth.addEventListener('input', updateTremoloDepth);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const distortion_toggle = document.getElementById('distortion-toggle');
    }
    }
    }
    }
    }
    }
    }
    }
    }
    if (distortion_toggle) {
        distortion_toggle.addEventListener('change', toggleDistortion);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const distortion_amount = document.getElementById('distortion-amount');
    }
    }
    }
    }
    }
    }
    }
    }
    if (distortion_amount) {
        distortion_amount.addEventListener('input', updateDistortionAmount);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const volume_sensitivity = document.getElementById('volume-sensitivity');
    }
    }
    }
    }
    }
    }
    }
    if (volume_sensitivity) {
        volume_sensitivity.addEventListener('input', updateVolumeSensitivity);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    
    // Preset system events
    const save_preset = document.getElementById('save-preset');
    }
    }
    }
    }
    }
    }
    if (save_preset) {
        save_preset.addEventListener('click', savePreset);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const preset_select = document.getElementById('preset-select');
    }
    }
    }
    }
    }
    if (preset_select) {
        preset_select.addEventListener('change', loadPreset);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    
    // Recording events
    const record_button = document.getElementById('record-button');
    }
    }
    }
    }
    if (record_button) {
        record_button.addEventListener('click', toggleRecording);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    
    // Tutorial events
    const show_tutorial = document.getElementById('show-tutorial');
    }
    }
    }
    if (show_tutorial) {
        show_tutorial.addEventListener('click', showTutorial);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const close_tutorial = document.getElementById('close-tutorial');
    }
    }
    if (close_tutorial) {
        close_tutorial.addEventListener('click', closeTutorial);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    const close_welcome = document.getElementById('close-welcome');
    }
    if (close_welcome) {
        close_welcome.addEventListener('click', closeWelcomeScreen);
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
}

// Set up the Web Audio API context and nodes

function setupAudioContext() {
    try {
        // Check if AudioContext is supported
        if (typeof AudioContext !== 'undefined') {
            audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            audioContext = new webkitAudioContext();
        } else {
            throw new Error('Web Audio API is not supported in this browser');
        }
        
        // Initialize audio nodes
        if (audioContext) {
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            reverbNode = audioContext.createConvolver();
            analyserNode = audioContext.createAnalyser();
            distortionNode = audioContext.createWaveShaper();
            
            // Setup tremolo
            tremoloNode = audioContext.createGain();
            tremoloOscillator = audioContext.createOscillator();
            
            // Configure nodes
            oscillator.type = document.getElementById('waveform-select').value;
            oscillator.frequency.value = MIN_FREQUENCY;
            gainNode.gain.value = 0;
            
            // Setup tremolo
            tremoloOscillator.type = 'sine';
            tremoloOscillator.frequency.value = 5;
            tremoloNode.gain.value = 1;
            
            // Connect nodes
            oscillator.connect(distortionNode);
            distortionNode.connect(tremoloNode);
            tremoloOscillator.connect(tremoloNode.gain);
            tremoloNode.connect(gainNode);
            gainNode.connect(reverbNode);
            reverbNode.connect(analyserNode);
            analyserNode.connect(audioContext.destination);
            
            // Start oscillators
            oscillator.start();
            tremoloOscillator.start();
            
            // Setup visualization
            setupVisualization();
        }
    } catch (error) {
        console.error('Error setting up audio context:', error);
        alert('Failed to initialize audio. Please try a different browser.');
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
    
    // Fade out to avoid clicks
    if (gainNode) {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    }
    
    setTimeout(() => {
        isPlaying = false;
        document.getElementById('play-button').textContent = 'Play';
    }, 100);
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
    const depth = parseFloat(document.getElementById('tremolo-depth').value);
    if (tremoloOscillator && tremoloNode) {
        tremoloOscillator.frequency.value = parseFloat(document.getElementById('tremolo-rate').value);
        tremoloNode.gain.value = 1 - depth * 0.5;
    }
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
    const preset = presets[name];
    if (!preset) {
        console.error(`Preset "${name}" not found`);
        return;
    }
    
    currentPreset = name;
    
    // Update UI elements with preset values
    const controls = {
        'waveform-select': preset.waveform || 'sine',
        'reverb-toggle': preset.reverb || false,
        'reverb-amount': preset.reverbAmount || 0.5,
        'tremolo-rate': preset.tremoloRate || 5,
        'tremolo-depth': preset.tremoloDepth || 0,
        'distortion-amount': preset.distortionAmount || 0
    };
    
    // Update each control
    Object.entries(controls).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (!element) return;
        
        if (typeof value === 'boolean') {
            element.checked = value;
        } else {
            element.value = value;
        }
    });
    
    // Update sound if currently playing
    if (isPlaying) {
        updateWaveform();
        toggleReverb();
        updateReverbAmount();
        updateTremoloRate();
        updateTremoloDepth();
        updateDistortion();
    }
    
    // Update preset selector
    const presetSelector = document.getElementById('preset-select');
    if (presetSelector) {
        presetSelector.value = name;
    }
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
    if (!canvas) {
        console.error('Visualization canvas not found');
        return;
    }
    
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx || !analyserNode) return;
    
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
        requestAnimationFrame(draw);
        
        analyserNode.getByteFrequencyData(dataArray);
        
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
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
    if (isRecording) return;
    
    if (!audioContext) {
        alert('Audio context not initialized. Please start playing first.');
        return;
    }
    
    if (typeof MediaRecorder === 'undefined') {
        alert('MediaRecorder API is not supported in this browser');
        return;
    }
    
    try {
        recordedChunks = [];
        const dest = audioContext.createMediaStreamDestination();
        
        if (analyserNode) {
            analyserNode.connect(dest);
        }
        
        mediaRecorder = new MediaRecorder(dest.stream);
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = createDownloadLink;
        
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('record-button').textContent = 'Stop Recording';
        document.getElementById('record-button').classList.add('recording');
    } catch (error) {
        console.error('Recording error:', error);
        alert('Failed to start recording: ' + error.message);
    }
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
    isRecording = false;
    document.getElementById('record-button').textContent = 'Record';
    document.getElementById('record-button').classList.remove('recording');
    
    if (!recordedChunks || recordedChunks.length === 0) {
        console.error('No recorded audio data available');
        return;
    }
    
    try {
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.getElementById('download-link');
        
        if (downloadLink) {
            downloadLink.href = url;
            downloadLink.download = 'theremin-recording.webm';
            downloadLink.style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Error creating download link:', error);
        alert('Failed to create download link: ' + error.message);
    }
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