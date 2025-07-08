// js/main.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Active Sidebar Link ---
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Sidebar Dropdown Logic ---
    document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            const parentLi = toggle.parentElement;
            const dropdownMenu = parentLi.querySelector('.nav-dropdown-menu');

            document.querySelectorAll('.nav-item-dropdown').forEach(item => {
                if (item !== parentLi && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.nav-dropdown-menu').style.maxHeight = null;
                }
            });

            parentLi.classList.toggle('active');

            if (parentLi.classList.contains('active')) {
                dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
            } else {
                dropdownMenu.style.maxHeight = null;
            }
        });
    });

    // Auto-open active dropdown
    const activeSubLink = document.querySelector('.nav-dropdown-menu a.active');
    if (activeSubLink) {
        const parentDropdown = activeSubLink.closest('.nav-item-dropdown');
        if (parentDropdown) {
            const dropdownMenu = parentDropdown.querySelector('.nav-dropdown-menu');
            parentDropdown.classList.add('active');
            dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
        }
    }


    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            item.querySelector('.faq-question').addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }

    // --- Bill Calculator Logic ---
    const calculatorForm = document.getElementById('billCalculator');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const units = parseFloat(document.getElementById('units').value);
            const resultDiv = document.getElementById('result');
            let energyCharge = 0;

            if (isNaN(units) || units < 0) {
                resultDiv.innerHTML = `<p style="color: red;">Please enter a valid number of units.</p>`;
                return;
            }

            if (units <= 50) energyCharge = units * 1.95;
            else if (units <= 100) energyCharge = (50 * 1.95) + ((units - 50) * 3.10);
            else energyCharge = (50 * 1.95) + (50 * 3.10) + ((units - 100) * 4.50);

            const fixedCharge = 25.00, customerCharge = 50.00, electricityDuty = units * 0.06;
            const total = energyCharge + fixedCharge + customerCharge + electricityDuty;

            resultDiv.innerHTML = `
                <h4>Bill Breakdown:</h4>
                <ul class="billing-info">
                    <li><span>Energy Charge:</span> <strong>₹${energyCharge.toFixed(2)}</strong></li>
                    <li><span>Fixed Charge:</span> <strong>₹${fixedCharge.toFixed(2)}</strong></li>
                    <li><span>Customer Charge:</span> <strong>₹${customerCharge.toFixed(2)}</strong></li>
                    <li><span>Electricity Duty:</span> <strong>₹${electricityDuty.toFixed(2)}</strong></li>
                    <li style="font-size: 1.2rem; border-top: 2px solid var(--primary-color); margin-top: 10px; padding-top: 10px;"><span>Net Bill Amount:</span> <strong>₹${total.toFixed(2)}</strong></li>
                </ul>`;
        });
    }

    // --- Chart.js for Bill History ---
    const usageChartCanvas = document.getElementById('usageChart');
    if (usageChartCanvas) {
        const ctx = usageChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Usage in kWh',
                    data: [120, 150, 180, 170, 160, 190],
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(0, 74, 173, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }
    
    // --- Disbursement Progress ---
    const disburseBtn = document.getElementById('disburseBtn');
    if(disburseBtn) {
        let total = 1000, disbursed = 0;
        disburseBtn.addEventListener('click', () => {
             if (disbursed < total) disbursed = Math.min(disbursed + 200, total);

            let percent = (disbursed / total) * 100;
            document.getElementById('disbursedAmount').innerText = disbursed.toLocaleString();
            const progressFill = document.getElementById('progressFill');
            progressFill.style.width = `${percent}%`;
            progressFill.innerText = `${Math.round(percent)}%`;

            if (disbursed >= total) {
                document.getElementById('status').innerText = "Completed";
                progressFill.style.background = "linear-gradient(90deg, #2196F3, #64b5f6)";
                disburseBtn.disabled = true;
                disburseBtn.innerText = "Fully Disbursed";
            }
        });
    }
});