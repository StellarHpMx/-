document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn") || document.getElementById("payBtn");

  if (!cartPanel || !cartItemsContainer) return;

  // Crear botón de cerrar si no existe
  if (!document.getElementById("closeCart")) {
    const closeBtn = document.createElement("button");
    closeBtn.id = "closeCart";
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      background:none;border:none;color:white;
      font-size:20px;position:absolute;top:10px;right:15px;
      cursor:pointer;
    `;
    cartPanel.prepend(closeBtn);
    closeBtn.addEventListener("click", () => cartPanel.classList.remove("open"));
  }

  // Cargar carrito desde localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Función para actualizar vista y total
  function actualizarVista() {
    if (carrito.length === 0) {
      cartItemsContainer.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
      if (cartCount) cartCount.textContent = "0";
      actualizarTotal(0);
      return;
    }

    cartItemsContainer.innerHTML = carrito.map(p => {
      const key = `${p.nombre}-${p.talla}-${p.color}`;
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.nombre}">
          <div class="meta">
            <strong>${p.nombre}</strong>
            <small>Talla: ${p.talla}</small>
            <small>Color: ${p.color}</small>
            <div class="qty">
              <button onclick="changeQuantity('${key}', -1)">−</button>
              <span>${p.cantidad}</span>
              <button onclick="changeQuantity('${key}', 1)">+</button>
            </div>
            <small>$${(p.precio * p.cantidad).toFixed(2)} MXN</small>
          </div>
          <button class="remove-btn" onclick="removeFromCart('${key}')">✕</button>
        </div>
      `;
    }).join("");

    const total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
    actualizarTotal(total);
    if (cartCount) cartCount.textContent = carrito.reduce((s, p) => s + p.cantidad, 0);
  }

  function actualizarTotal(total) {
    const totalLine = document.getElementById("cartTotalLine");
    if (totalLine) totalLine.textContent = `Total: $${total.toFixed(2)} MXN`;
  }

  // Guardar cambios
  function guardarYActualizar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarVista();
  }

  // Abrir/cerrar panel
  if (cartBtn) cartBtn.onclick = () => {
    actualizarVista(); // <-- aseguramos que siempre esté actualizado al abrir
    cartPanel.classList.toggle("open");
  };

  // Agregar producto (función global)
  window.addToCart = (nombre, precio, img, talla = "-", color = "-", cantidad = 1) => {
    const existente = carrito.find(
      p => p.nombre === nombre && p.talla === talla && p.color === color
    );
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ nombre, precio, img, talla, color, cantidad });
    }
    guardarYActualizar();
    cartPanel.classList.add("open"); // abre carrito al agregar
  };

  // Eliminar producto
  window.removeFromCart = (key) => {
    carrito = carrito.filter(p => `${p.nombre}-${p.talla}-${p.color}` !== key);
    guardarYActualizar();
  };

  // Cambiar cantidad
  window.changeQuantity = (key, delta) => {
    const producto = carrito.find(p => `${p.nombre}-${p.talla}-${p.color}` === key);
    if (producto) {
      producto.cantidad = Math.max(1, producto.cantidad + delta);
      guardarYActualizar();
    }
  };

  // Pagar por WhatsApp
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      actualizarVista(); // <-- aseguramos que carrito está actualizado
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      let mensaje = "🛍️ *Pedido STELLAR HP:*\n\n";
      carrito.forEach(p => {
        mensaje += `• ${p.nombre} (${p.talla}, ${p.color}) x${p.cantidad} = $${(p.precio * p.cantidad).toFixed(2)}\n`;
      });

      const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
      mensaje += `\nTotal: *$${total.toFixed(2)} MXN*\n\nGracias por tu compra 🙌`;

      const numero = "5215657923327"; // 🔢 cambia a tu número real
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
    });
  }

  // Inicializa vista
  actualizarVista();
});
