function initParallax() {
    const previewContainer = document.getElementById('preview-container');
    const layers = document.querySelectorAll('.parallax-layer');
    
    if (!previewContainer || layers.length === 0) return;
    
    // Calculate center position
    const centerX = previewContainer.offsetWidth / 2;
    const centerY = previewContainer.offsetHeight / 2;
    
    // Set initial positions
    layers.forEach(layer => {
        layer.style.position = 'absolute';
        layer.style.width = '100%';
        layer.style.height = '100%';
        layer.style.backgroundSize = 'cover';
        layer.style.backgroundPosition = 'center';
        layer.style.top = '0';
        layer.style.left = '0';
    });
    
    // Add mousemove/touchmove event
    previewContainer.addEventListener('mousemove', handleParallax);
    previewContainer.addEventListener('touchmove', handleParallax);
    
    function handleParallax(e) {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!x || !y) return;
        
        const rect = previewContainer.getBoundingClientRect();
        const relX = x - rect.left;
        const relY = y - rect.top;
        
        // Calculate percentage from center
        const percentX = (relX - centerX) / centerX;
        const percentY = (relY - centerY) / centerY;
        
        layers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth);
            const moveX = percentX * 20 * depth;
            const moveY = percentY * 20 * depth;
            
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
}