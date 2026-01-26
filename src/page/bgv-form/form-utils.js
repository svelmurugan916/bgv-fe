export async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => resolve(img);
    });
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return canvas.toDataURL('image/jpeg');
}

export const scrollToFirstError = (errors) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
        // 1. Get the first error key (e.g., "firstName" or "edu_123_level")
        const firstErrorKey = errorKeys[0];
        console.error(firstErrorKey);

        // 2. Find the element by ID
        const element = document.getElementById(firstErrorKey);
        console.log('scroll elenebt - ',element);

        if (element) {
            // 3. Smooth scroll
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // 4. Visual feedback
            element.classList.add('animate-shake');
            setTimeout(() => element.classList.remove('animate-shake'), 500);
        }
    }
};