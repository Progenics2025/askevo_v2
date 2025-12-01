export const voiceService = {
  // Speech Recognition (Speech-to-Text)
  startListening(onResult, onError, language = 'en-US', onEndCallback = null) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech Recognition not supported in this browser');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.language = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Voice input started');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Send current text (final + interim) for real-time feedback
      const currentText = finalTranscript + interimTranscript;
      if (currentText) {
        onResult(currentText.trim(), !!finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      console.log('Voice input ended');
      if (onEndCallback) {
        onEndCallback();
      }
    };

    recognition.start();
    return recognition;
  },

  stopListening(recognition) {
    if (recognition) {
      recognition.stop();
    }
  },

  // Text-to-Speech
  speak(text, language = 'en-US', onEnd = null) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  stopSpeaking() {
    window.speechSynthesis.cancel();
  },

  isSpeaking() {
    return window.speechSynthesis.speaking;
  },

  getAvailableVoices() {
    return window.speechSynthesis.getVoices();
  }
};

export default voiceService;
