document.addEventListener('DOMContentLoaded', function() {
    const components = document.querySelectorAll('.component');
    const assemblyCanvas = document.getElementById('assembly-canvas');
    const previewCanvas = document.getElementById('preview-canvas');
    const totalCostElem = document.getElementById('total-cost');
    const finalTotalCostElem = document.getElementById('final-total-cost');
    const clearAssemblyBtn = document.getElementById('clear-assembly');
    const checkoutBtn = document.getElementById('checkout');

    components.forEach(component => {
        component.addEventListener('dragstart', dragStart);
        component.addEventListener('click', handleClick);
        const priceElem = component.querySelector('p:last-child');
        const price = component.dataset.price;
        priceElem.textContent = formatPrice(price);
    });

    assemblyCanvas.addEventListener('dragover', dragOver);
    assemblyCanvas.addEventListener('drop', drop);

    clearAssemblyBtn.addEventListener('click', clearAssembly);
    // No need to change addToCartBtn event listener

    // Actualizamos el estado del botón "Pagar" inicialmente
    updateCheckoutButton();

    function updateCheckoutButton() {
        if (assemblyCanvas.children.length === 0) {
            // No hay productos, desactivamos el botón
            checkoutBtn.disabled = true;
        } else {
            // Hay productos, activamos el botón
            checkoutBtn.disabled = false;
        }
    }

    checkoutBtn.addEventListener('click', function(event) {
        // Verificar si hay productos en el área de ensamblaje y en la vista previa
        if (assemblyCanvas.children.length === 0 && previewCanvas.children.length === 0) {
            // No hay productos en ninguno de los contenedores
            event.preventDefault(); // Detener el comportamiento predeterminado del evento
            alert('Debes agregar productos antes de proceder al pago.');
        } else {
            // Guardar los productos seleccionados en el localStorage
            const components = [];
            assemblyCanvas.querySelectorAll('div').forEach(componentElem => {
                components.push({
                    component: componentElem.querySelector('p').textContent.split(' - ')[0],
                    price: parseInt(componentElem.dataset.price, 10),
                    imageSrc: componentElem.querySelector('img').src,
                    descripcion: "Descripción del producto" // Añade la descripción que consideres necesaria
                });
            });
            localStorage.setItem('productosSeleccionados', JSON.stringify(components));

            // Navegar a la página de pago
            window.location.href = 'ExperienciaDePago1.html';
        }
    });
    

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            component: this.dataset.component,
            price: this.dataset.price,
            imageSrc: this.querySelector('img').src
        }));
    }

    function handleClick() {
        const data = {
            component: this.dataset.component,
            price: this.dataset.price,
            imageSrc: this.querySelector('img').src
        };
        addToAssembly(data);
        animatePop(this);
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
        updateCheckoutButton(); // Actualizamos el estado del botón "Pagar"
    }

    function updateTotalCost() {
        const components = assemblyCanvas.querySelectorAll('div');
        let total = 0;
        components.forEach(component => {
            total += parseInt(component.dataset.price, 10);
        });
        const formattedTotal = formatPrice(total);
        totalCostElem.textContent = formattedTotal;

    }


    function clearAssembly() {
        assemblyCanvas.innerHTML = '';
        updateTotalCost();
    
        updateCheckoutButton(); // Actualizamos el estado del botón "Pagar"
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
});