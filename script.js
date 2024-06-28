document.addEventListener('DOMContentLoaded', () => {
    const components = document.querySelectorAll('.component');
    const assemblyCanvas = document.getElementById('assembly-canvas');
    const previewCanvas = document.getElementById('preview-canvas');
    const totalCostElem = document.getElementById('total-cost');
    const finalTotalCostElem = document.getElementById('final-total-cost');
    const clearAssemblyBtn = document.getElementById('clear-assembly');
    const addToCartBtn = document.getElementById('add-to-cart');
    const checkoutBtn = document.getElementById('checkout');

    components.forEach(component => {
        component.addEventListener('dragstart', dragStart);
        component.addEventListener('click', () => {
            const data = {
                component: component.dataset.component,
                price: component.dataset.price,
                imageSrc: component.querySelector('img').src
            };
            addToAssembly(data);
            animatePop(component);
        });
    });

    assemblyCanvas.addEventListener('dragover', dragOver);
    assemblyCanvas.addEventListener('drop', drop);

    clearAssemblyBtn.addEventListener('click', clearAssembly);
    addToCartBtn.addEventListener('click', addToCart);
    checkoutBtn.addEventListener('click', checkout);

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            component: this.dataset.component,
            price: this.dataset.price,
            imageSrc: this.querySelector('img').src
        }));
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        addToAssembly(data);
    }

    function addToAssembly(data) {
        const componentElem = document.createElement('div');
        componentElem.dataset.price = data.price;
        componentElem.innerHTML = `
            <img src="${data.imageSrc}" alt="${data.component}">
            <p>${data.component} - ${formatPrice(data.price)}</p>
        `;
        componentElem.addEventListener('click', () => {
            componentElem.remove();
            updateTotalCost();
            updatePreview();
        });
        assemblyCanvas.appendChild(componentElem);
        updateTotalCost();
        updatePreview();
    }

    function updateTotalCost() {
        const components = assemblyCanvas.querySelectorAll('div');
        let total = 0;
        components.forEach(component => {
            total += parseInt(component.dataset.price, 10);
        });
        const formattedTotal = formatPrice(total);
        totalCostElem.textContent = formattedTotal;
        finalTotalCostElem.textContent = formattedTotal;
    }

    function updatePreview() {
        previewCanvas.innerHTML = assemblyCanvas.innerHTML;
    }

    function clearAssembly() {
        assemblyCanvas.innerHTML = '';
        updateTotalCost();
        updatePreview();
    }

    function addToCart() {
        alert('Pedido agregado al carrito');
    }

    function checkout() {
        alert('Procediendo al pago');
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    }

    function animatePop(component) {
        component.classList.add('pop');
        setTimeout(() => {
            component.classList.remove('pop');
        }, 300); // duration of the animation
    }

    components.forEach(component => {
        const priceElem = component.querySelector('p:last-child');
        const price = component.dataset.price;
        priceElem.textContent = formatPrice(price);
    });
});
