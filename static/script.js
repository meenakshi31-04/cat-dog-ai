document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const clearBtn = document.getElementById('clearBtn');
    const predictBtn = document.getElementById('predictBtn');
    const loader = document.getElementById('loader');
    const resultBox = document.getElementById('resultBox');
    const resultClass = document.getElementById('resultClass');
    const confidenceBadge = document.getElementById('confidenceBadge');
    const confidenceBar = document.getElementById('confidenceBar');

    let selectedFile = null;

    // --- 1. File Selection Logic ---
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-brand-500', 'bg-slate-800-force');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-brand-500', 'bg-slate-800-force');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-brand-500', 'bg-slate-800-force');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length) handleFile(this.files[0]);
    });

    function handleFile(file) {
        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        selectedFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            
            // UI Transitions
            dropZone.classList.add('hidden');
            previewContainer.classList.remove('hidden');
            previewContainer.classList.add('fade-in');
            predictBtn.classList.remove('hidden');
            predictBtn.classList.add('fade-in');
            
            // Reset results
            resultBox.classList.add('hidden');
            confidenceBar.style.width = '0%';
        };
        reader.readAsDataURL(file);
    }

    // --- 2. Clear Selection Logic ---
    clearBtn.addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        
        // Reset UI
        previewContainer.classList.add('hidden');
        predictBtn.classList.add('hidden');
        resultBox.classList.add('hidden');
        dropZone.classList.remove('hidden');
        dropZone.classList.add('fade-in');
    });

    // --- 3. Backend Communication Logic ---
    predictBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        // Set Loading State
        predictBtn.classList.add('hidden');
        loader.classList.remove('hidden');
        resultBox.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();

            // Remove Loading State
            loader.classList.add('hidden');
            
            if (data.error) {
                showError(data.error);
            } else {
                showResult(data.class, data.confidence);
            }

        } catch (error) {
            loader.classList.add('hidden');
            showError('Network error. Ensure the server is running.');
            predictBtn.classList.remove('hidden');
        }
    });

    // --- 4. Display Logic ---
    function showResult(predictedClass, confidence) {
        resultBox.classList.remove('hidden');
        resultBox.classList.add('fade-in');
        
        resultClass.innerText = predictedClass;
        confidenceBadge.innerText = `${confidence}% Match`;
        
        // Change colors based on the class for a dynamic feel
        if(predictedClass === 'Dog') {
            resultClass.className = 'text-3xl font-bold text-amber-400 mb-2';
            confidenceBar.className = 'bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full transition-all duration-1000 ease-out';
        } else {
            resultClass.className = 'text-3xl font-bold text-brand-400 mb-2';
            confidenceBar.className = 'bg-gradient-to-r from-brand-500 to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out';
        }

        // Animate the bar
        setTimeout(() => {
            confidenceBar.style.width = `${confidence}%`;
        }, 100);
    }

    function showError(message) {
        resultBox.classList.remove('hidden');
        resultClass.innerText = 'Error';
        resultClass.className = 'text-3xl font-bold text-red-500 mb-2';
        confidenceBadge.innerText = 'Failed';
        confidenceBadge.className = 'px-2.5 py-1 rounded-md text-xs font-bold bg-red-900/30 border border-red-800 text-red-400';
        confidenceBar.style.width = '100%';
        confidenceBar.className = 'bg-red-500 h-2 rounded-full';
        console.error(message);
    }
});