document.addEventListener("DOMContentLoaded", () => {
  // ====== MENU RESPONSIVE ======
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // ====== CARRITO ======
  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const closeCart = document.getElementById('closeCart');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const checkoutBtn = document.getElementById('checkoutBtn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

  function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    if(cart.length === 0){
      cartItemsContainer.innerHTML = 'Tu carrito está vacío 🛒';
      cartCount.textContent = '0';
      cartTotalLine.textContent = 'Total: $0 MXN';
      return;
    }

    cart.forEach((item,index)=>{
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <p><strong>${item.name}</strong></p>
          <p>$${item.price} x ${item.quantity}</p>
        </div>
        <button class="remove-btn" data-index="${index}">✖</button>
      `;
      cartItemsContainer.appendChild(div);
      total += item.price * item.quantity;
    });

    cartCount.textContent = cart.reduce((sum,i)=>sum+i.quantity,0);
    document.getElementById('cartTotalLine').textContent = `Total: $${total.toFixed(2)} MXN`;

    document.querySelectorAll('.remove-btn').forEach(btn=>{
      btn.onclick = () => {
        const index = btn.dataset.index;
        cart.splice(index,1);
        updateCart();
        saveCart();
      }
    });

    saveCart();
  }

  cartBtn.onclick = ()=> cartPanel.classList.add('open');
  closeCart.onclick = ()=> cartPanel.classList.remove('open');

  window.addToCart = (name, price, image) => {
    const existing = cart.find(i=>i.name===name);
    if(existing){ existing.quantity++; } 
    else { cart.push({name, price, image, quantity:1}); }
    updateCart();
    cartPanel.classList.add('open');
  }

  checkoutBtn.onclick = ()=>{
    if(cart.length===0){ alert('Tu carrito está vacío'); return; }
    let message = cart.map(i=>`${i.name} x${i.quantity} = $${i.price*i.quantity}`).join('%0A');
    let total = cart.reduce((acc,i)=>acc+i.price*i.quantity,0);
    window.open(`https://wa.me/?text=Hola,%20quiero%20comprar:%0A${message}%0ATotal:$${total.toFixed(2)} MXN`,'_blank');
  }

  updateCart();
});
