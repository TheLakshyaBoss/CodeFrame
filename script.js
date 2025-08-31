const codeInput = document.getElementById('codeInput');
const previewCode = document.getElementById('previewCode');
const renderBtn = document.getElementById('renderBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const langSelect = document.getElementById('lang');
const previewTitle = document.getElementById('previewTitle');
const fontSizeInput = document.getElementById('fontSize');
const charCount = document.getElementById('charCount');
const captureArea = document.getElementById('captureArea');

function renderSnippet() {
    const code = codeInput.value;
    const langClass = langSelect.value;
    previewCode.className = langClass;
    previewCode.textContent = code;
    Prism.highlightElement(previewCode);
    previewTitle.textContent = document.getElementById('title').value || 'snippet';
    previewCode.style.fontSize = fontSizeInput.value + 'px';
    charCount.textContent = code.length;
}

codeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

        this.selectionStart = this.selectionEnd = start + 1;

        renderSnippet();
    }
});

let timeout;
codeInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(renderSnippet, 300);
});

langSelect.addEventListener('change', renderSnippet);
document.getElementById('title').addEventListener('input', () => {
    previewTitle.textContent = document.getElementById('title').value || 'snippet';
});
fontSizeInput.addEventListener('change', () => {
    previewCode.style.fontSize = fontSizeInput.value + 'px';
});

renderBtn.addEventListener('click', renderSnippet);

downloadBtn.addEventListener('click', () => {
    const prevBg = captureArea.style.background;
    captureArea.style.background = getComputedStyle(captureArea).backgroundColor || '#0b0f14';
    html2canvas(captureArea, { scale:2, useCORS:true, backgroundColor: null })
    .then(canvas => {
        canvas.toBlob(blob => {
            const a = document.createElement('a');
            a.download = (document.getElementById('title').value || 'snippet') + '.png';
            a.href = URL.createObjectURL(blob);
            a.click();
            URL.revokeObjectURL(a.href);
        });
    })
    .catch(err => {
        alert('Could not create image. Try again.');
        console.error(err);
    })
    .finally(() => {
        captureArea.style.background = prevBg;
    });
});

copyBtn.addEventListener('click', () => {
    const html = captureArea.outerHTML;
    navigator.clipboard.writeText(html).then(() => {
        copyBtn.textContent = 'Copied';
        setTimeout(()=> copyBtn.textContent = 'Copy HTML', 1200);
        }).catch(()=> {
            alert('Copy failed');
    });
});

renderSnippet();