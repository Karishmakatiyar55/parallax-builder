document.addEventListener('DOMContentLoaded', function() {
    // Initialize with 2 default layers
    addLayer();
    addLayer();
    
    // Set up event listeners
    document.getElementById('add-layer-btn').addEventListener('click', addLayer);
    document.getElementById('generate-btn').addEventListener('click', generateExperience);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    // Live preview updates
    document.getElementById('text-input').addEventListener('input', updatePreview);
    document.getElementById('text-color').addEventListener('input', updatePreview);
    document.getElementById('text-size').addEventListener('input', updatePreview);
    document.getElementById('parallax-intensity').addEventListener('input', updatePreview);
});

let layers = [];

function addLayer() {
    const layersList = document.getElementById('layers-list');
    const layerId = Date.now();
    
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    layerItem.dataset.layerId = layerId;
    
    layerItem.innerHTML = `
        <label for="layer-${layerId}-image">Layer ${layers.length + 1}</label>
        <input type="file" id="layer-${layerId}-image" accept="image/*">
        <button class="remove-layer">Remove</button>
    `;
    
    layersList.appendChild(layerItem);
    
    // Set up event listeners for this layer
    const fileInput = layerItem.querySelector(`#layer-${layerId}-image`);
    fileInput.addEventListener('change', function(e) {
        handleImageUpload(e, layerId);
    });
    
    layerItem.querySelector('.remove-layer').addEventListener('click', function() {
        if (layersList.children.length > 2) {
            layersList.removeChild(layerItem);
            layers = layers.filter(layer => layer.id !== layerId);
            updatePreview();
        } else {
            alert('You need at least 2 layers');
        }
    });
    
    // Add to layers array
    layers.push({
        id: layerId,
        image: null,
        element: null
    });
}

function handleImageUpload(event, layerId) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const layer = layers.find(l => l.id === layerId);
        if (layer) {
            layer.imageUrl = e.target.result;
            updatePreview();
        }
    };
    reader.readAsDataURL(file);
}

function updatePreview() {
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = '';
    
    // Get text values
    const text = document.getElementById('text-input').value;
    const textColor = document.getElementById('text-color').value;
    const textSize = document.getElementById('text-size').value + 'px';
    
    // Create parallax layers
    layers.forEach((layer, index) => {
        if (layer.imageUrl) {
            const layerElement = document.createElement('div');
            layerElement.className = 'parallax-layer';
            layerElement.style.backgroundImage = `url(${layer.imageUrl})`;
            layerElement.style.zIndex = index;
            
            // Calculate depth based on intensity
            const intensity = document.getElementById('parallax-intensity').value;
            const depth = (index + 1) * (intensity / 10);
            layerElement.dataset.depth = depth;
            
            previewContainer.appendChild(layerElement);
            layer.element = layerElement;
        }
    });
    
    // Add text if exists
    if (text) {
        const textElement = document.createElement('div');
        textElement.className = 'parallax-text';
        textElement.textContent = text;
        textElement.style.color = textColor;
        textElement.style.fontSize = textSize;
        textElement.style.zIndex = layers.length + 1;
        previewContainer.appendChild(textElement);
    }
    
    // Initialize parallax effect
    initParallax();
}

function generateExperience() {
    // In a real app, you would save this to a database and get a unique URL
    // For this demo, we'll just generate a QR code for the current state
    
    // Create a unique identifier (in a real app, this would be a server-generated ID)
    const experienceId = 'parallax-' + Date.now();
    
    // Generate QR code
    const qr = qrcode(0, 'L');
    qr.addData(`${window.location.origin}/experience/${experienceId}`);
    qr.make();
    
    document.getElementById('qr-code').innerHTML = qr.createImgTag(4);
    document.getElementById('qr-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('qr-modal').style.display = 'none';
}