// 1. Pi Network SDK Initialization
const Pi = window.Pi;
try {
    Pi.init({ version: "2.0", sandbox: true });
} catch(e) {
    console.log("Pi SDK error:", e);
}

let currentUser = null;

// 2. Login Button
const loginBtn = document.querySelector('.user-auth-btn, header button');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            const auth = await Pi.authenticate(['username', 'payments'], function(payment){});
            currentUser = auth.user;
            loginBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> @${currentUser.username}`;
            loginBtn.style.background = "#10b981";
            alert(`Welcome @${currentUser.username}! Your Pi Wallet is successfully connected.`);
        } catch(err) {
            alert("Login failed. Please access this site using the Pi Browser.");
        }
    });
}

// 3. All Bottom Navigation Buttons (Home, Categories, Cart, Profile)
const navItems = document.querySelectorAll('.bottom-nav .nav-item, .nav-item');
navItems.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Active state formatting
        navItems.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabName = btn.innerText.trim().toLowerCase();

        if (tabName.includes('profile')) {
            if (currentUser) {
                alert(`User Profile:\nUsername: @${currentUser.username}\nStatus: Verified Pioneer`);
            } else {
                alert("Profile Page: Please click the Login button at the top to connect your Pi Wallet.");
            }
        } else if (tabName.includes('cart')) {
            alert("Shopping Cart: Your cart is currently empty.");
        } else if (tabName.includes('categories')) {
            alert("Categories: Select a category from the top bar to filter products.");
        } else if (tabName.includes('home')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// 4. Pay with Pi Buttons (Product Cards)
const buyBtns = document.querySelectorAll('.buy-btn, button:has(.fa-wallet)');
buyBtns.forEach(btn => {
    if (!btn.innerText.includes('Login')) {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card') || btn.parentElement;
            const title = card.querySelector('h3, .product-title')?.innerText || "Product";
            const priceText = card.querySelector('.price, .product-price')?.innerText || "1";
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 1;

            if (!currentUser) {
                alert("Authentication required: Please login with your Pi Wallet at the top before making a purchase.");
                return;
            }

            Pi.createPayment({
                amount: price,
                memo: `Payment for ${title}`,
                metadata: { item: title }
            }, {
                onReadyForServerCompletion: function(paymentId, txid) {
                    alert(`Payment Successful!\nItem: ${title}\nTransaction ID: ${txid}`);
                }
            });
        });
    }
});

// 5. Search Box Functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('keyup', () => {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const title = card.innerText.toLowerCase();
            if (title.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}
