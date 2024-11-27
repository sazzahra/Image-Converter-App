document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const transformOption = document.getElementById('transformOption');
    const convertButton = document.getElementById('convertButton');
    const backButton = document.getElementById('backButton');
    const originalCanvas = document.getElementById('originalCanvas');
    const transformedCanvas = document.getElementById('transformedCanvas');
    const uploadSection = document.querySelector('.upload-section');
    const resultSection = document.querySelector('.result-section');

    let originalImage = null;

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    originalImage = img;
                    drawToCanvas(originalCanvas, img);
                    convertButton.disabled = false;
                };
            };
            reader.readAsDataURL(file);
        }
    });

    convertButton.addEventListener('click', () => {
        if (!originalImage) return;

        const selectedOption = transformOption.value;
        if (selectedOption === 'grayscale') {
            applyGrayscale(originalImage, transformedCanvas);
        } else if (selectedOption === 'blur') {
            applyBlur(originalImage, transformedCanvas);
        }

        uploadSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
    });

    backButton.addEventListener('click', () => {
        uploadSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });

    function drawToCanvas(canvas, image) {
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
    }

    function applyGrayscale(image, canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const avg = (r + g + b) / 3;

            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function applyBlur(image, canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        const tempData = new Uint8ClampedArray(data); // Temp data for blur

        const kernelSize = 3;
        const halfKernel = Math.floor(kernelSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, count = 0;

                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;

                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const index = (ny * width + nx) * 4;
                            r += tempData[index];
                            g += tempData[index + 1];
                            b += tempData[index + 2];
                            count++;
                        }
                    }
                }

                const i = (y * width + x) * 4;
                data[i] = r / count;
                data[i + 1] = g / count;
                data[i + 2] = b / count;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
});
