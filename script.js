(function() {
    'use strict';

    function initProductFilter() {
        const productSection = document.querySelector('section[id="products"], section:has(article)');
        if (!productSection) return;

        const articles = Array.from(productSection.querySelectorAll('article'));
        if (articles.length === 0) return;

        const categories = new Set();
        categories.add('All');
        articles.forEach(article => {
            const heading = article.querySelector('h3')?.innerText || '';
            let category = 'Other';
            if (heading.match(/cake/i)) category = 'Cakes';
            else if (heading.match(/muffin/i)) category = 'Muffins';
            else if (heading.match(/cupcake/i)) category = 'Cupcakes';
            else if (heading.match(/ice cream/i)) category = 'Ice Cream';
            else if (heading.match(/scone/i)) category = 'Scones';
            else if (heading.match(/cookie/i)) category = 'Cookies';
            else if (heading.match(/candy/i)) category = 'Candy';
            categories.add(category);
        });

        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-buttons';
        filterContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; justify-content: center;';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            btn.style.cssText = 'background: #f3c6a5; border: none; padding: 8px 18px; border-radius: 40px; cursor: pointer; font-weight: bold;';
            btn.addEventListener('click', () => {
                articles.forEach(article => {
                    const heading = article.querySelector('h3')?.innerText || '';
                    let articleCat = 'Other';
                    if (heading.match(/cake/i)) articleCat = 'Cakes';
                    else if (heading.match(/muffin/i)) articleCat = 'Muffins';
                    else if (heading.match(/cupcake/i)) articleCat = 'Cupcakes';
                    else if (heading.match(/ice cream/i)) articleCat = 'Ice Cream';
                    else if (heading.match(/scone/i)) articleCat = 'Scones';
                    else if (heading.match(/cookie/i)) articleCat = 'Cookies';
                    else if (heading.match(/candy/i)) articleCat = 'Candy';
                    if (cat === 'All' || articleCat === cat) {
                        article.style.display = '';
                    } else {
                        article.style.display = 'none';
                    }
                });
                
                document.querySelectorAll('.filter-buttons button').forEach(b => {
                    b.style.background = '#f3c6a5';
                    b.style.color = '#c4783e';
                });
                btn.style.background = '#c47a4f';
                btn.style.color = 'white';
            });
            filterContainer.appendChild(btn);
        });
        
        const firstArticle = productSection.querySelector('article');
        if (firstArticle) {
            productSection.insertBefore(filterContainer, firstArticle);
        } else {
            productSection.prepend(filterContainer);
        }
        
        const allBtn = filterContainer.querySelector('button');
        if (allBtn) allBtn.click();
    }

    function initCartSimulator() {
        const articles = document.querySelectorAll('article');
        if (articles.length === 0) return;

        const cartDiv = document.createElement('div');
        cartDiv.className = 'cart-total';
        cartDiv.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #2c1a14; color: #ffcd94; padding: 12px 20px; border-radius: 40px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000; cursor: pointer;';
        cartDiv.innerHTML = 'Total: R0 <span style="font-size:0.8rem;">(click to reset)</span>';
        document.body.appendChild(cartDiv);

        let total = 0;

        function updateCartDisplay() {
            cartDiv.innerHTML = `Total: R${total} <span style="font-size:0.8rem;">(click to reset)</span>`;
            if (total >= 200) {
                cartDiv.style.background = '#c47a4f';
                cartDiv.style.color = 'white';
                cartDiv.style.animation = 'pulse 0.5s';
                setTimeout(() => { cartDiv.style.animation = ''; }, 500);
                
                if (!window._offerAlertShown) {
                    alert(' Great news! You\'ve reached R200+ → You qualify for FREE candy bag + FREE muffin! Mention "SWEET200" at checkout.');
                    window._offerAlertShown = true;
                }
            } else {
                cartDiv.style.background = '#d26e4d';
                cartDiv.style.color = '#ffcd94';
                window._offerAlertShown = false;
            }
        }

        articles.forEach(article => {
            const priceElement = article.querySelector('strong') || article.querySelector('p strong');
            let price = 0;
            if (priceElement) {
                const priceText = priceElement.innerText.match(/\d+/);
                if (priceText) price = parseInt(priceText[0], 10);
            }
            if (price === 0) return; 

            const addBtn = document.createElement('button');
            addBtn.textContent = `Add to cart (R${price})`;
            addBtn.style.cssText = 'background: #e6a17a; border: none; padding: 6px 12px; border-radius: 30px; margin-top: 10px; cursor: pointer; font-weight: bold; color: white;';
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                total += price;
                updateCartDisplay();
            });
            article.appendChild(addBtn);
        });

        cartDiv.addEventListener('click', () => {
            total = 0;
            updateCartDisplay();
            window._offerAlertShown = false;
        });
    }

    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.hasAttribute('data-js-validated')) return;
            form.setAttribute('data-js-validated', 'true');

            form.addEventListener('submit', function(e) {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#c45c3a';
                        field.style.backgroundColor = '#fff0f0';
                        // Add error message if not exists
                        let errorMsg = field.parentNode.querySelector('.error-msg');
                        if (!errorMsg) {
                            errorMsg = document.createElement('small');
                            errorMsg.className = 'error-msg';
                            errorMsg.style.color = '#c45c3a';
                            errorMsg.style.display = 'block';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                        errorMsg.textContent = 'This field is required';
                    } else {
                        field.style.borderColor = '#e6c8a7';
                        field.style.backgroundColor = 'white';
                        const errorMsg = field.parentNode.querySelector('.error-msg');
                        if (errorMsg) errorMsg.remove();
                    }
                });

                const emailField = form.querySelector('input[type="email"]');
                if (emailField && emailField.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(emailField.value.trim())) {
                        isValid = false;
                        emailField.style.borderColor = '#c45c3a';
                        let errorMsg = emailField.parentNode.querySelector('.error-msg');
                        if (!errorMsg) {
                            errorMsg = document.createElement('small');
                            errorMsg.className = 'error-msg';
                            errorMsg.style.color = '#c45c3a';
                            emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
                        }
                        errorMsg.textContent = 'Please enter a valid email address';
                    }
                }

                if (!isValid) {
                    e.preventDefault();
                    alert('Please fill in all required fields correctly.');
                } else {
                
                    e.preventDefault(); 
                    alert('Thank you! Your enquiry has been sent. We will get back to you soon.');
                    form.reset();
                }
            });
        });
    }

    function initStickyOffer() {
        const banner = document.querySelector('.offer-banner, div[style*="background-color:#f9e6cf"], section > div:first-child');
        if (!banner) return;
        const stickyBanner = banner.cloneNode(true);
        stickyBanner.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: #ffe1b3; border: 2px solid #f4a261; border-radius: 0 0 20px 20px; padding: 8px; text-align: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: none;';
        document.body.prepend(stickyBanner);

        window.addEventListener('scroll', () => {
            const bannerRect = banner.getBoundingClientRect();
            if (bannerRect.top < 0) {
                stickyBanner.style.display = 'block';
            } else {
                stickyBanner.style.display = 'none';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initProductFilter();
        initCartSimulator();
        initFormValidation();
        initStickyOffer();
    });
})();