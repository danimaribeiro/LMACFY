document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    const creationMode = document.getElementById('creation-mode');
    const animationMode = document.getElementById('animation-mode');
    const fakeCursor = document.getElementById('fake-cursor');

    if (query) {
        creationMode.classList.add('hidden');
        animationMode.classList.remove('hidden');
        fakeCursor.classList.remove('hidden');
        startAnimation(query);
    } else {
        animationMode.classList.add('hidden');
        creationMode.classList.remove('hidden');
        setupCreationMode();
    }
});

function setupCreationMode() {
    const input = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const generatedLink = document.getElementById('generated-link');
    const copyBtn = document.getElementById('copy-btn');
    const previewLink = document.getElementById('preview-link');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            generateLink();
        }
    });

    generateBtn.addEventListener('click', generateLink);

    function generateLink() {
        const text = input.value.trim();
        if (!text) return;

        const baseUrl = window.location.origin + window.location.pathname;
        const url = `${baseUrl}?q=${encodeURIComponent(text)}`;

        generatedLink.value = url;
        previewLink.href = url;
        resultContainer.classList.remove('hidden');
    }

    copyBtn.addEventListener('click', () => {
        generatedLink.select();
        document.execCommand('copy');

        const originalText = copyBtn.innerText;
        copyBtn.innerText = '[COPIED!]';
        setTimeout(() => {
            copyBtn.innerText = originalText;
        }, 2000);
    });
}

function startAnimation(query) {
    const cursor = document.getElementById('fake-cursor');
    const textElement = document.getElementById('fake-input-text');
    const sendBtn = document.getElementById('fake-send-btn');
    const snarkyMessage = document.getElementById('snarky-message');

    setTimeout(() => {
        // 1. Move cursor to input area
        const textRect = textElement.getBoundingClientRect();
        const targetX = textRect.left + 10;
        const targetY = textRect.top + textRect.height / 2;

        cursor.style.transform = `translate(${targetX}px, ${targetY}px)`;

        setTimeout(() => {
            // 2. Start typing
            textElement.classList.add('typing');

            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < query.length) {
                    textElement.textContent += query.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    textElement.classList.remove('typing');

                    // 3. Move cursor to send button
                    setTimeout(() => {
                        const btnRect = sendBtn.getBoundingClientRect();
                        cursor.style.transform = `translate(${btnRect.left + btnRect.width / 2}px, ${btnRect.top + btnRect.height / 2}px)`;

                        setTimeout(() => {
                            // 4. Click send
                            sendBtn.style.transform = 'scale(0.9)';
                            setTimeout(() => sendBtn.style.transform = 'scale(1)', 100);

                            // 5. Hide cursor, show terminal logs
                            setTimeout(() => {
                                cursor.classList.add('hidden');
                                const output = document.getElementById('terminal-output');
                                const logs = [
                                    { text: "[*] Initializing connection to Claude...", type: "normal" },
                                    { text: "[*] Transmitting encoded prompt...", type: "normal" },
                                    { text: "[*] Analyzing user behavior...", type: "normal" },
                                    { text: "[!] WARNING: Extreme levels of laziness detected.", type: "error" },
                                    { text: "[*] Rerouting to manual mode...", type: "normal" },
                                ];

                                let logIndex = 0;
                                const logInterval = setInterval(() => {
                                    if (logIndex < logs.length) {
                                        const line = document.createElement('div');
                                        line.className = 'log-line';
                                        if (logs[logIndex].type === 'error') {
                                            line.classList.add('error-line');
                                        }
                                        line.innerText = logs[logIndex].text;
                                        output.appendChild(line);
                                        logIndex++;
                                    } else {
                                        clearInterval(logInterval);

                                        // 6. Show final snarky message
                                        setTimeout(() => {
                                            snarkyMessage.innerText = "🎉 Task failed successfully. Was that so hard? Now go ask Claude yourself!";
                                            snarkyMessage.classList.remove('hidden');
                                        }, 600);
                                    }
                                }, 800);

                            }, 500);
                        }, 1000);
                    }, 500);
                }
            }, 100);

        }, 1200);
    }, 500);
}
