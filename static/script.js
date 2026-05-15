document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const swapBtn = document.getElementById('swapBtn');
    const translateBtn = document.getElementById('translateBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const ttsBtn = document.getElementById('ttsBtn');
    const charCount = document.getElementById('charCount');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorBox = document.getElementById('errorBox');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Load History from Local Storage
    let translationHistory = JSON.parse(localStorage.getItem('translationHistory')) || [];
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.addEventListener('start', () => {
            isListening = true;
            setVoiceButtonState(true);
            hideError();
        });

        recognition.addEventListener('result', (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');

            sourceText.value = transcript;
            updateCharCount();

            if (event.results[event.results.length - 1].isFinal) {
                handleTranslate();
            }
        });

        recognition.addEventListener('error', (event) => {
            showError(getSpeechErrorMessage(event.error));
        });

        recognition.addEventListener('end', () => {
            isListening = false;
            setVoiceButtonState(false);
        });
    } else {
        voiceBtn.disabled = true;
        voiceBtn.title = 'Voice input is not supported in this browser';
    }

    renderHistory();

    // Event Listeners
    sourceText.addEventListener('input', updateCharCount);
    clearBtn.addEventListener('click', clearText);
    swapBtn.addEventListener('click', swapLanguages);
    copyBtn.addEventListener('click', copyTranslation);
    ttsBtn.addEventListener('click', playTTS);
    voiceBtn.addEventListener('click', toggleVoiceInput);
    translateBtn.addEventListener('click', handleTranslate);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Functions
    function updateCharCount() {
        const count = sourceText.value.length;
        charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    function clearText() {
        sourceText.value = '';
        targetText.value = '';
        updateCharCount();
        hideError();
    }

    function swapLanguages() {
        if (sourceLang.value === 'auto') return; // Cannot swap to auto detect
        
        const tempLang = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = tempLang;

        const tempText = sourceText.value;
        sourceText.value = targetText.value;
        targetText.value = tempText;

        updateCharCount();
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }

    function toggleVoiceInput() {
        if (!recognition) {
            showError('Voice input is not supported in this browser. Please try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognition.stop();
            return;
        }

        const selectedSource = sourceLang.value;
        if (selectedSource !== 'auto') {
            recognition.lang = selectedSource;
        } else {
            recognition.lang = navigator.language || 'en-US';
        }

        targetText.value = '';
        recognition.start();
    }

    function setVoiceButtonState(listening) {
        const icon = voiceBtn.querySelector('i');
        voiceBtn.classList.toggle('listening', listening);
        voiceBtn.title = listening ? 'Listening... click to stop' : 'Voice Input';
        icon.className = listening ? 'fa-solid fa-stop' : 'fa-solid fa-microphone';
    }

    function getSpeechErrorMessage(error) {
        const messages = {
            'not-allowed': 'Microphone permission was blocked. Please allow microphone access and try again.',
            'no-speech': 'No speech was detected. Please try speaking again.',
            'audio-capture': 'No microphone was found. Please connect a microphone and try again.',
            'network': 'Voice recognition needs an internet connection. Please check your network and try again.'
        };

        return messages[error] || 'Voice input failed. Please try again.';
    }

    async function handleTranslate() {
        const text = sourceText.value.trim();
        const source = sourceLang.value;
        const target = targetLang.value;

        // Validation
        if (!text) {
            showError('Please enter some text to translate.');
            return;
        }
        if (source === target && source !== 'auto') {
            showError('Source and target languages cannot be the same.');
            return;
        }

        hideError();
        loadingOverlay.classList.remove('hidden');

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, source, target }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed.');
            }

            targetText.value = data.translated_text;

            // Save to history
            saveToHistory({
                srcName: sourceLang.options[sourceLang.selectedIndex].text,
                tgtName: targetLang.options[targetLang.selectedIndex].text,
                original: text,
                translated: data.translated_text
            });

        } catch (error) {
            showError(error.message);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    function copyTranslation() {
        const text = targetText.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
            }, 2000);
        }).catch(() => {
            showError('Failed to copy to clipboard.');
        });
    }

    function playTTS() {
        const text = targetText.value;
        if (!text) return;

        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            // Try to set language based on target code (usually first two letters)
            utterance.lang = targetLang.value.split('-')[0];
            
            window.speechSynthesis.speak(utterance);
        } else {
            showError('Text-to-Speech is not supported in this browser.');
        }
    }

    function saveToHistory(item) {
        // Add to beginning, keep only last 10
        translationHistory.unshift(item);
        if (translationHistory.length > 10) {
            translationHistory.pop();
        }
        localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        
        if (translationHistory.length === 0) {
            historyList.innerHTML = '<li style="color: var(--text-muted); font-size: 0.9rem;">No history yet.</li>';
            return;
        }

        translationHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            li.innerHTML = `
                <div class="history-meta">${item.srcName} ➔ ${item.tgtName}</div>
                <div class="history-text">
                    <span class="src" title="${item.original}">${item.original}</span>
                    <span class="arrow"><i class="fa-solid fa-arrow-right"></i></span>
                    <span class="tgt" title="${item.translated}">${item.translated}</span>
                </div>
            `;
            historyList.appendChild(li);
        });
    }

    function clearHistory() {
        translationHistory = [];
        localStorage.removeItem('translationHistory');
        renderHistory();
    }
});
