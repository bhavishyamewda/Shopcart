// Order Tracking Core Script Logic
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let orderId = urlParams.get('orderId');
    const justPlaced = urlParams.get('placed');
    
    const searchInput = document.getElementById('tracking-id-input');
    const searchBtn = document.getElementById('track-submit-btn');
    const alertBox = document.getElementById('tracking-success-alert');
    const dynamicId = document.getElementById('display-order-id');
    const steps = document.querySelectorAll('.tracking-step');

    if (justPlaced && alertBox) {
        alertBox.style.display = 'block';
    }

    if (!orderId) {
        orderId = localStorage.getItem('last_order_id') || "SKP-584912";
    }

    if(orderId) {
        searchInput.value = orderId;
        executeTracking(orderId);
    }

    searchBtn.addEventListener('click', () => {
        if(searchInput.value.trim() !== "") {
            executeTracking(searchInput.value.trim());
        }
    });

    function executeTracking(id) {
        dynamicId.textContent = id;
        
        // Dynamic deterministic steps generator based on order number string length hashes
        let activeSteps = (id.charCodeAt(id.length - 1) % 3) + 2; // Returns 2, 3 or 4 stages active
        
        steps.forEach((step, idx) => {
            if (idx <= activeSteps) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
});