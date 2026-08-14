document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    const creationMode = document.getElementById('creation-mode');
    const animationMode = document.getElementById('animation-mode');

    if (query) {
        // Animation Mode
        creationMode.classList.add('hidden');
        animationMode.classList.remove('hidden');
        startAnimation(query);
    } else {
        // Creation Mode
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
        // 1. Move to input box
        const textElementRect = textElement.getBoundingClientRect();
        const targetX = textElementRect.left + 10;
        const targetY = textElementRect.top + textElementRect.height / 2;
        
        cursor.style.transform = `translate(${targetX}px, ${targetY}px)`;

        setTimeout(() => {
            // 2. "Click"
            textElement.classList.add('typing');
            
            // 3. Type
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < query.length) {
                    textElement.textContent += query.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    textElement.classList.remove('typing');
                    
                    // 4. Move to send button
                    setTimeout(() => {
                        const btnRect = sendBtn.getBoundingClientRect();
                        const btnTargetX = btnRect.left + btnRect.width / 2;
                        const btnTargetY = btnRect.top + btnRect.height / 2;
                        
                        cursor.style.transform = `translate(${btnTargetX}px, ${btnTargetY}px)`;
                        
                        setTimeout(() => {
                            // 5. Click send
                            sendBtn.style.transform = 'scale(0.9)';
                            setTimeout(() => sendBtn.style.transform = 'scale(1)', 100);
                            
                            // 6. Show message
                            setTimeout(() => {
                                snarkyMessage.classList.remove('hidden');
                                
                                // 7. Redirect
                                setTimeout(() => {
                                    window.location.href = "https://claude.ai/new";
                                }, 3000);
                            }, 500);
                            
                        }, 1000);
                    }, 500);
                }
            }, 100); // typing speed
            
        }, 1200); // wait for move animation
    }, 500);
}
