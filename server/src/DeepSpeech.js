const DeepSpeech = require('deepspeech');
const mic = require('mic');
const fs = require('fs');
const readline = require('readline'); // Required for listening to key press

// Load DeepSpeech model
const modelPath = './deepspeech-0.9.3-models.pbmm'; // Update with your model path
const scorerPath = './deepspeech-0.9.3-models.scorer'; // Update with your scorer path

const model = new DeepSpeech.Model(modelPath);
model.enableExternalScorer(scorerPath);

// Audio configuration
const SAMPLE_RATE = 16000;

// Create a streaming session
const stream = model.createStream();

console.log('Listening for speech...');

// Set up microphone input using mic
const microphone = mic({
    rate: SAMPLE_RATE,
    channels: '1',
    debug: true,
    exitOnSilence: 6, // Automatically stop recording after 6 seconds of silence
});

const micInputStream = microphone.getAudioStream();

// Set up readline interface for key press detection
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Press "q" to stop recording...\n', () => {
    rl.close();
    microphone.stop();
    console.log('Recording stopped.');
    const transcription = stream.finishStream();
    console.log('Final transcription:', transcription);

    // Exit the process gracefully
    process.exit();
});

micInputStream.on('data', (data) => {
    console.log('Received audio data of length:', data.length);
    try {
        // Convert the data into a Buffer, which can be used for DeepSpeech
        const buffer = Buffer.from(data);
        const audioData = new Int16Array(buffer.buffer);
        stream.feedAudioContent(audioData);
    } catch (err) {
        console.error('Error processing audio:', err);
    }
});

micInputStream.on('error', (err) => {
    console.error('Error in microphone stream:', err);
});

micInputStream.on('end', () => {
    console.log('Recording ended.');
    const transcription = stream.finishStream();
    console.log('Final transcription:', transcription);
    process.exit(); // Ensure the process ends properly
});

// Start recording
microphone.start();

// Handle shutdown
process.on('SIGINT', () => {
    microphone.stop();
    console.log('\nStopped listening.');
    process.exit();
});
