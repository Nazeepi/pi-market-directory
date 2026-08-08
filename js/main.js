/**
 * PI MARKETPLACE MAIN JAVASCRIPT
 * Fixes 404 navigation and authentication trigger
 */

const Pi = window.Pi;
let currentUser = null;

// Initialize Pi SDK safely
try {
    if (typeof Pi !== 'undefined') {
        Pi.init({ version: "2.0", sandbox: true });
    }
} catch (e) {
    console.log("Pi SDK Initialization Error:", e);
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. HANDLE PI AUTHENTICATION (Login / Connect Pi Wallet)
    const authBtns = document.querySelectorAll('.btn-pi-auth');
    authBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (typeof Pi === 'undefined') {
                alert("Please open this app inside the Pi Browser to login.");
                return;
            }

            try {
                const auth = await Pi.authenticate(['username', 'payments'], function(payment){});
                currentUser = auth.user;

                btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>@${currentUser.username}</span>`;
                btn.style.color = "#10b981";

                alert(`Welcome @${currentUser.username}! Your Pi Wallet is successfully connected.`);
            } catch(err) {
                alert("Authentication Error: Please make sure you are using the official Pi Browser.");
            }
        });
    });

    // 2. SAFE NAVIGATION (Fixes 404 Error)
    const navBtns = document.querySelectorAll('.btn-nav');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = btn.getAttribute('data-page');

            // Skip navigation if it's the Login button
            if (btn.classList.contains('btn-pi-auth')) {
                return;
            }

            if (page) {
                e.preventDefault();
                // Get repository base path to avoid 404 error
                const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                window.location.href = basePath + page;
            }
        });
    });

    // 3. HANDLE PAYMENTS
    const payBtns = document.querySelectorAll('.btn-pi-pay');
    payBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const card = btn.closest('.product-card');
            const title = card ? card.querySelector('.product-title').innerText : "Product Item";
            const price = btn.getAttribute('data-price') || 1;

            if (!currentUser) {
                alert("Please click 'Login' at the bottom to connect your Pi Wallet first.");
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

});
