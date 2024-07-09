const backgroundCanvas = document.getElementById('backgroundCanvas');
const ctxBackground = backgroundCanvas.getContext('2d');
const body = document.body;

backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

const nodes = [];
const lines = [];
const maxNodes = 50;
const maxDistance = 100;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2 + Math.random() * 3;
        this.dx = (Math.random() - 0.5) * 0.5; // Velocidad reducida un 50%
        this.dy = (Math.random() - 0.5) * 0.5; // Velocidad reducida un 50%
        this.color = '#D1D1D1'; // Color por defecto en modo oscuro
    }

    draw = () => {
        ctxBackground.beginPath();
        ctxBackground.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxBackground.fillStyle = this.color;
        ctxBackground.fill();
    };

    update = () => {
        this.x += this.dx;
        this.y += this.dy;
        
        if (this.x < 0 || this.x > backgroundCanvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > backgroundCanvas.height) this.dy *= -1;
    };
}

class Line {
    constructor(nodeA, nodeB) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.color = '#D1D1D1'; // Color por defecto en modo oscuro
    }

    draw = () => {
        ctxBackground.beginPath();
        ctxBackground.moveTo(this.nodeA.x, this.nodeA.y);
        ctxBackground.lineTo(this.nodeB.x, this.nodeB.y);
        ctxBackground.strokeStyle = this.color;
        ctxBackground.stroke();
    };
}

const createNodes = () => {
    nodes.length = 0;
    for (let i = 0; i < maxNodes; i++) {
        const x = Math.random() * backgroundCanvas.width;
        const y = Math.random() * backgroundCanvas.height;
        nodes.push(new Node(x, y));
    }
};

const animate = () => {
    ctxBackground.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    lines.length = 0;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
            const otherNode = nodes[j];
            const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
            if (distance < maxDistance) {
                lines.push(new Line(node, otherNode));
            }
        }
    }

    lines.forEach(line => line.draw());
    requestAnimationFrame(animate);
};

const handleResize = () => {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    createNodes();
};

const connectNodesToCursor = (x, y) => {
    lines.length = 0;
    nodes.forEach(node => {
        const distance = Math.hypot(node.x - x, node.y - y);
        if (distance < maxDistance) {
            nodes.forEach(otherNode => {
                if (otherNode !== node) {
                    const otherDistance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                    if (otherDistance < maxDistance) {
                        lines.push(new Line(node, otherNode));
                    }
                }
            });
        }
    });
};

createNodes();
animate();

window.addEventListener('resize', handleResize);

backgroundCanvas.addEventListener('mousemove', event => {
    const rect = backgroundCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    connectNodesToCursor(x, y);
});

backgroundCanvas.addEventListener('touchmove', event => {
    event.preventDefault();
    const rect = backgroundCanvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    connectNodesToCursor(x, y);
});

const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
body.classList.toggle('light-mode', prefersDarkScheme.matches);

darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('light-mode');
    updateNodeColors();
});

const updateNodeColors = () => {
    const isLightMode = body.classList.contains('light-mode');
    nodes.forEach(node => {
        node.color = '#D1D1D1'; // Ajustar los colores según el modo claro/oscuro
    });
    lines.forEach(line => {
        line.color = '#D1D1D1'; // Ajustar los colores según el modo claro/oscuro
    });
};
