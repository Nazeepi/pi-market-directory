/**
 * PI MARKETPLACE MAIN JAVASCRIPT
 * Handles authentication, navigation, and Pi Network payments
 */

// Initialize Pi SDK safely
const Pi = window.Pi;
let currentUser = null;

try {
    if (typeof Pi !== 'undefined') {
        Pi.init({ version: "2.0", sandbox: true });
    }
} catch (e) {
    console.log("Pi SDK Initialization Error:", e);
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. HANDLE LOGIN / CONNECT BUTTONS
    const authBtns = document.querySelectorAll('.btn-pi-auth');
    authBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (typeof Pi === 'undefined') {
                alert("Pi SDK not loaded. Please open this app inside the Pi Browser.");
                return;
            }

            try {
                const auth = await Pi.authenticate(['username', 'payments'], function(payment){});
                currentUser = auth.user;

                btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>@${currentUser.username}</span>`;
                btn.style.color = "#10b981";

                alert(`Welcome @${currentUser.username}! Your Pi Wallet is successfully connected.`);
            } catch(err) {
                alert("Login Failed: Please make sure you are using the official Pi Browser.");
            }
        });
    });

    // 2. HANDLE PAGE NAVIGATION (Dashboard, Register Shop, Home)
    const navBtns = document.querySelectorAll('.btn-nav');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = btn.getAttribute('data-page');

            if (page) {
                e.preventDefault();
                window.location.href = page;
            }
        });
    });

    // 3. HANDLE PAYMENTS (Pay with Pi)
    const payBtns = document.querySelectorAll('.btn-pi-pay');
    payBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const card = btn.closest('.product-card');
            const title = card ? card.querySelector('.product-title').innerText : "Product Item";
            const price = btn.getAttribute('data-price') || 1;

            if (!currentUser) {
                alert("Authentication Required: Please click 'Login' at the bottom to connect your Pi Wallet before buying.");
                return;
            }

            Pi.createPayment({
                amount: parseFloat(price),
                memo: `Purchase of ${title}`,
                metadata: { item: title }
            }, {
                onReadyForServerCompletion: function(paymentId, txid) {
                    alert(`Payment Successful!\nItem: ${title}\nTransaction ID: ${txid}`);
                }
            });
        });
    });

    // 4. SEARCH BAR FILTERING
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const query = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');

            cards.forEach(card => {
                const title = card.innerText.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

});
