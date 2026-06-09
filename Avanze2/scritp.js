
let xpActual = 0;
let nivel = 1;
let carrito = [];


const SpringDataRepository = {
    async findAll() {
        return [
            { id: 1, nombre: "Cyber World 2077", cat: "Juego", precio: 39.99, xp: 40, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400" },
            { id: 2, nombre: "Fantasy Realms", cat: "Juego", precio: 19.99, xp: 15, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" },
            { id: 3, nombre: "Neon Racer", cat: "Juego", precio: 29.99, xp: 30, img: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&q=80&w=400" },
            { id: 4, nombre: "GR270033 Dreizt RGB PRO", cat: "Hardware", precio: 49.99, xp: 35, img: "https://www.dreiztgamer.com/cdn/shop/files/soporte-audifonos-gamer-dreizt-rgb-pro_064630f3-a01b-4c1f-81e0-c3015782d63c.jpg?v=1752099658" },
            { id: 5, nombre: "TKL 64 Teclas RainbowLED", cat: "Hardware", precio: 17.99, xp: 25, img: "https://pe-media.hptiendaenlinea.com/magefan_blog/Teclados_mec_nicos_todo_lo_que_necesit_s_saber.jpg" },
            { id: 6, nombre: "mouse logitech", cat: "Hardware", precio: 15.99, xp: 20, img: "https://hiraoka.com.pe/media/mageplaza/blog/post/l/o/logitech-mejores_accesorios_de_computo_y_gaming.jpg" }
        ];
    }
};

let categoriaActual = 'Todos';

function logServer(texto) {
    const terminal = document.getElementById('server-logs');
    if (terminal) {
        terminal.innerHTML += `<br>&gt; ${texto}`;
        terminal.scrollTop = terminal.scrollHeight; // Auto-scroll al final
    }
}

const SecurityMiddleware = {
    aplicarDescuentos(precioBase, nivelUsuario) {
        if (nivelUsuario >= 5) {
            return precioBase * 0.90;
        }
        return precioBase;
    },
    validarStock(idProducto) {
        logServer(`Validando stock para producto ID: ${idProducto}...`);
        return true;
    }
};

function validarAcceso(event) {
    event.preventDefault();

    // Capturamos el texto de ambas cajas del HTML
    const user = document.getElementById('user-name').value;
    const pass = document.getElementById('user-pass').value;
    const status = document.getElementById('login-status');
    const btn = document.getElementById('btn-login');

    btn.innerText = "VERIFICANDO...";
    status.innerHTML = `&gt; Solicitando POST /api/auth/login...`;
    status.style.color = "var(--accent)";

    setTimeout(() => {

        if (user === "admin" && pass === "12345") {
            status.innerHTML = `&gt; Acceso Concedido. Bienvenido, ${user}.`;
            status.style.color = "var(--accent-green)";

            localStorage.setItem('gamevault_user', user);

            setTimeout(() => {
                document.getElementById('login-overlay').style.display = 'none';
                logServer(`AUTH: Sesión iniciada por ${user}`);
                mostrarLogro(`Bienvenido, ${user}`);
            }, 1000);
        } else {
            // Si falla el usuario o la contraseña, rebota aquí
            status.innerHTML = `&gt; ERROR: Usuario o clave incorrectos.`;
            status.style.color = "#ff4444";
            btn.innerText = "REINTENTAR";
        }
    }, 1500);
}

function revisarSesion() {
    const sesion = localStorage.getItem('gamevault_user');
    if (sesion) {
        document.getElementById('login-overlay').style.display = 'none';
        logServer(`AUTH: Sesión restaurada para ${sesion}`);
    }
}

async function renderizarTienda() {
    const productos = await SpringDataRepository.findAll();
    const grid = document.getElementById('grid-productos');
    if (!grid) return;
    grid.innerHTML = '';

    const productosFiltrados = categoriaActual === 'Todos'
        ? productos
        : productos.filter(p => p.cat === categoriaActual);

    productosFiltrados.forEach(juego => {
        const precioFinal = SecurityMiddleware.aplicarDescuentos(juego.precio, nivel);
        const tieneDescuento = nivel >= 5;

        grid.innerHTML += `
            <article class="game-card" data-category="${juego.cat}">
                <div class="badge-discount ${tieneDescuento ? '' : 'hidden'}">SALE -10%</div>
                <img src="${juego.img}" class="game-img" alt="${juego.nombre}">
                <div class="card-body">
                    <small style="color:var(--accent); font-weight:bold;">${juego.cat.toUpperCase()}</small>
                    <h3>${juego.nombre}</h3>
                    <div class="price-row">
                        <span class="price">$${precioFinal.toFixed(2)}</span>
                        <span class="xp-text">+${juego.xp} XP</span>
                    </div>
                    <button class="btn-buy" onclick="agregarAlCarrito(${juego.id})">Añadir al Carrito</button>
                </div>
            </article>`;
    });
}

async function filtrarCategoria(categoria, boton) {
    categoriaActual = categoria;
    document.querySelectorAll('.pill').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');
    logServer(`Filtrando catálogo por: ${categoria}...`);
    renderizarTienda();
}


async function agregarAlCarrito(id) {
    const productos = await SpringDataRepository.findAll();
    const juego = productos.find(p => p.id === id);

    if (SecurityMiddleware.validarStock(id)) {
        carrito.push(juego);
        logServer(`CARRITO: Agregado "${juego.nombre}"`);
        actualizarCarritoUI();
        mostrarLogro(`¡Añadido al carrito!`);
    }
}

function actualizarCarritoUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.getElementById('cart-count');

    if (cartCount) cartCount.innerText = carrito.length;
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-dim); text-align: center; margin-top: 30px;">Tu carrito está vacío 🎮</p>';
    } else {
        carrito.forEach((juego, index) => {
            const precioConDescuento = SecurityMiddleware.aplicarDescuentos(juego.precio, nivel);
            total += precioConDescuento;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${juego.nombre}</h4>
                        <span class="cart-item-price">$${precioConDescuento.toFixed(2)}</span>
                    </div>
                    <button class="btn-remove" onclick="eliminarDelCarrito(${index})">🗑️</button>
                </div>
            `;
        });
    }
    if (cartTotalPrice) cartTotalPrice.innerText = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    logServer(`CARRITO: Removido "${carrito[index].nombre}"`);
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function abrirCheckout() {
    if (carrito.length === 0) {
        mostrarLogro("El carrito está vacío 🎮");
        return;
    }
    const totalCarrito = document.getElementById('cart-total-price').innerText;
    document.getElementById('checkout-total').innerText = `$${totalCarrito}`;

    document.getElementById('cart-modal').classList.remove('active');
    document.getElementById('checkout-modal').classList.add('active');
    logServer("Iniciando pasarela de pago segura...");
}

function cerrarCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
}

async function procesarTransaccion(event) {
    event.preventDefault();

    const nombre = document.getElementById('card-name').value;
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = "VERIFICANDO TARJETA... 🛡️";
    btn.disabled = true;
    logServer(`Enviando solicitud de cargo seguro para: ${nombre}`);

    setTimeout(() => {
        logServer("Respuesta del Servidor: 201 Created - Transacción Exitosa");
        alert(`¡Transacción Exitosa! Gracias por tu compra, ${nombre}.`);

        let xpTotal = carrito.reduce((acc, item) => acc + item.xp, 0);
        subirXP(xpTotal);

        carrito = [];
        actualizarCarritoUI();
        cerrarCheckout();
        guardarProgreso();

        mostrarLogro(`¡Pago Exitoso! Ganaste ${xpTotal} XP`);

        btn.innerText = originalText;
        btn.disabled = false;
    }, 2000);
}

function subirXP(puntos) {
    xpActual += puntos;

    if (xpActual >= 100) {
        nivel += Math.floor(xpActual / 100);
        xpActual = xpActual % 100;
        mostrarLogro(`¡Ascenso! Ahora eres Nivel ${nivel}`);
        renderizarTienda();
        alert(`¡LEVEL UP! 🏆 Acabas de alcanzar el Nivel ${nivel}.`);
    }
    actualizarUI();
}

function actualizarUI() {
    const xpFill = document.getElementById('xp-fill');
    const xpText = document.getElementById('xp-text');
    const userLevel = document.getElementById('user-level');

    if (xpFill) xpFill.style.width = xpActual + "%";
    if (xpText) xpText.innerText = `${xpActual} / 100 XP`;
    if (userLevel) userLevel.innerText = `NIVEL ${nivel}`;
}

function mostrarLogro(texto) {
    const div = document.createElement('div');
    div.className = 'achievement';
    div.innerHTML = `
        <span class="achievement-icon">🏆</span>
        <div class="achievement-text">
            <strong style="display:block; font-size:0.8rem; color:var(--accent)">LOGRO DESBLOQUEADO</strong>
            <span>${texto}</span>
        </div>
    `;
    document.body.appendChild(div);

    setTimeout(() => div.classList.add('show'), 100);

    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 500);
    }, 4000);
}

const btnClaim = document.getElementById('btn-claim');
const rewardStatus = document.getElementById('reward-status');

if (btnClaim) {
    btnClaim.addEventListener('click', () => {
        const hoy = new Date().toDateString();
        const ultimoReclamo = localStorage.getItem('ultimoReclamo');

        if (ultimoReclamo === hoy) {
            mostrarLogro("Vuelve mañana para más premios");
            rewardStatus.innerText = "Ya has reclamado tu premio de hoy. 🛡️";
            btnClaim.style.display = "none";
            return;
        }

        const premios = [
            { nombre: "50 XP de Bonificación", valor: 50, tipo: "XP" },
            { nombre: "10 XP de Bonificación", valor: 10, tipo: "XP" },
            { nombre: "Cupón Especial", valor: 25, tipo: "XP" }
        ];

        const premioGanado = premios[Math.floor(Math.random() * premios.length)];
        subirXP(premioGanado.valor);

        localStorage.setItem('ultimoReclamo', hoy);
        mostrarLogro(`¡GANASTE: ${premioGanado.nombre}!`);
        rewardStatus.innerText = "¡Recompensa reclamada! Vuelve en 24 horas.";
        btnClaim.disabled = true;
        btnClaim.innerText = "RECLAMADO";
        guardarProgreso();
    });
}

function guardarProgreso() {
    const datos = { nivel, xpActual };
    localStorage.setItem('gamevault_save', JSON.stringify(datos));
    logServer("Estado del progreso guardado en LocalStorage.");
}

function cargarProgreso() {
    const guardado = localStorage.getItem('gamevault_save');
    if (guardado) {
        const datos = JSON.parse(guardado);
        nivel = datos.nivel;
        xpActual = datos.xpActual;
        logServer("Progreso de usuario restaurado de LocalStorage.");
    }
}

window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cartModal = document.getElementById('cart-modal');
    const btnOpenCart = document.getElementById('btn-open-cart');
    const btnCloseCart = document.getElementById('close-cart');
    const btnCheckout = document.getElementById('btn-checkout');
    const btnCloseCheckout = document.getElementById('close-checkout');

    if (btnOpenCart) btnOpenCart.addEventListener('click', () => cartModal.classList.add('active'));
    if (btnCloseCart) btnCloseCart.addEventListener('click', () => cartModal.classList.remove('active'));
    if (btnCheckout) btnCheckout.addEventListener('click', abrirCheckout);
    if (btnCloseCheckout) btnCloseCheckout.addEventListener('click', cerrarCheckout);

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) cartModal.classList.remove('active');
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', validarAcceso);

    const formPago = document.getElementById('form-pago');
    if (formPago) formPago.addEventListener('submit', procesarTransaccion);

    document.querySelectorAll('.filter-pills .pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            const categoria = e.target.getAttribute('data-categoria');
            filtrarCategoria(categoria, e.target);
        });
    });
});

window.onload = function () {
    revisarSesion();
    cargarProgreso();
    actualizarUI();
    renderizarTienda();
    actualizarCarritoUI();
    logServer(">>> Sistema GameVault iniciado y sincronizado.");
};