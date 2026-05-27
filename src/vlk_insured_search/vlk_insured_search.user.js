// ==UserScript==
// @name         VLK Insured Search
// @name:ru      VLK Insured Search
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds a single Asmens kodas field to the search form.
// @description:ru Добавляет единое поле Asmens kodas в форму поиска.
// @author       DayDve
// @license      MIT
// @icon         https://dpsdr.vlk.lt/img/icons/favicon-32x32.png
// @match        https://dpsdr.vlk.lt/
// @grant        none
// @keywords     vlk, asmens kodas, dpsdr, insured, search
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #custom-vlk-ui { margin-bottom: 20px; }
        .vlk-tabs { display: flex; border-bottom: 1px solid #dee2e6; margin-bottom: 15px; padding-left: 0; list-style: none; }
        .vlk-tab { padding: 8px 16px; cursor: pointer; background: transparent; border: 1px solid transparent; border-top-left-radius: 0.25rem; border-top-right-radius: 0.25rem; margin-bottom: -1px; color: #495057; }
        .vlk-tab:hover { border-color: #e9ecef #e9ecef #dee2e6; }
        .vlk-tab.active { background-color: #fff; border-color: #dee2e6 #dee2e6 #fff; color: #495057; }
        #panel-ak { display: none; }
        #panel-ak.active { display: block; }
        .ak-actions { display: flex; gap: 10px; }
        .d-none-important { display: none !important; }
    `;
    document.head.appendChild(style);

    function triggerVueInput(element, value) {
        if (!element) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function mountCustomUI(originalForm) {
        if (document.getElementById('custom-vlk-ui')) return;

        const uiContainer = document.createElement('div');
        uiContainer.id = 'custom-vlk-ui';

        uiContainer.innerHTML = `
            <div class="vlk-tabs">
                <div class="vlk-tab active" id="tab-ak">Asmens kodas</div>
                <div class="vlk-tab" id="tab-orig">Originali forma</div>
            </div>
            <div id="panel-ak" class="active">
                <form id="ak-form" autocomplete="on">
                    <div class="row g-2">
                        <div class="col-12">
                            <label for="ak-input" class="form-label">Asmens kodas</label>
                            <input type="text" id="ak-input" name="asmens_kodas" class="form-control background-grey" maxlength="11" autocomplete="on">
                            <div id="ak-error" style="color: #dc3545; font-size: 14px; min-height: 20px; margin-top: 5px;"></div>
                        </div>
                        <div class="col-12 d-flex justify-content-end mt-2">
                            <div class="ak-actions">
                                <button type="button" id="ak-reset" class="btn">Atstatyti</button>
                                <button type="submit" class="btn btn-primary">Vykdyti</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        `;

        originalForm.parentNode.insertBefore(uiContainer, originalForm);

        const tabAk = document.getElementById('tab-ak');
        const tabOrig = document.getElementById('tab-orig');
        const panelAk = document.getElementById('panel-ak');
        const akInput = document.getElementById('ak-input');
        const akError = document.getElementById('ak-error');
        const formAk = document.getElementById('ak-form');

        function switchToAk() {
            tabAk.classList.add('active');
            tabOrig.classList.remove('active');
            panelAk.classList.add('active');
            originalForm.classList.add('d-none-important');
        }

        function switchToOrig() {
            tabOrig.classList.add('active');
            tabAk.classList.remove('active');
            panelAk.classList.remove('active');
            originalForm.classList.remove('d-none-important');
        }

        tabAk.addEventListener('click', switchToAk);
        tabOrig.addEventListener('click', switchToOrig);

        switchToAk();

        const savedAk = sessionStorage.getItem('vlk_ak');
        if (savedAk) akInput.value = savedAk;

        document.getElementById('ak-reset').addEventListener('click', () => {
            akInput.value = '';
            akError.textContent = '';
            sessionStorage.removeItem('vlk_ak');
        });

        formAk.addEventListener('submit', (e) => {
            e.preventDefault();
            akError.textContent = '';
            const ak = akInput.value.trim();

            if (!/^[3-6]\d{10}$/.test(ak)) {
                akError.textContent = 'Neteisingas asmens kodo formatas';
                return;
            }

            sessionStorage.setItem('vlk_ak', ak);

            const genderDigit = parseInt(ak[0]);
            const isMale = (genderDigit % 2 !== 0);
            const yearPart = ak.substring(1, 3);
            let fullYear = (genderDigit <= 2) ? "18" : (genderDigit <= 4 ? "19" : "20");
            const dateStr = `${fullYear}${yearPart}-${ak.substring(3, 5)}-${ak.substring(5, 7)}`;

            const maleRadio = document.getElementById('maleRadio');
            const femaleRadio = document.getElementById('femaleRadio');
            const dateInput = document.getElementById('birthDate');
            const lastDigitsInput = document.getElementById('LastDigits');

            if (isMale && maleRadio) maleRadio.click();
            else if (!isMale && femaleRadio) femaleRadio.click();

            triggerVueInput(dateInput, dateStr);
            triggerVueInput(lastDigitsInput, ak.substring(7));

            let attempts = 0;
            const submitInterval = setInterval(() => {
                const submitBtn = originalForm.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    clearInterval(submitInterval);
                    submitBtn.click();
                } else if (++attempts > 15) {
                    clearInterval(submitInterval);
                    if (submitBtn) {
                        submitBtn.removeAttribute('disabled');
                        submitBtn.click();
                    }
                }
            }, 100);
        });
    }

    const observer = new MutationObserver(() => {
        const currentPath = window.location.pathname;
        const customUI = document.getElementById('custom-vlk-ui');
        const originalForm = document.getElementById('PublicSearchForm');

        if (currentPath === '/' || currentPath === '') {
            if (originalForm && !customUI) {
                mountCustomUI(originalForm);
            }
        } else {
            if (customUI) {
                customUI.remove();
            }
            if (originalForm) {
                originalForm.classList.remove('d-none-important');
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
