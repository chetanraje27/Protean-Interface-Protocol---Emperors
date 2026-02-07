
let currentTier = 'B';
let autoMode = true;
let simulationRunning = false;
let userState = {
    email: 'user@example.com',
    password: 'password123',
    focusField: 'email'
};

const elements = {
    cycle: document.getElementById('cycle'),
    progress: document.getElementById('progress'),
    currentTier: document.getElementById('current-tier'),
    networkType: document.getElementById('network-type'),
    networkSlider: document.getElementById('network-slider'),
    networkDetails: document.getElementById('network-details'),
    batteryLevel: document.getElementById('battery-level'),
    batterySlider: document.getElementById('battery-slider'),
    batteryWarning: document.getElementById('battery-warning'),
    emailInput: document.getElementById('email-input'),
    passwordInput: document.getElementById('password-input'),
    tierName: document.getElementById('tier-name'),
    autoBtn: document.getElementById('auto-btn'),
    manualBtn: document.getElementById('manual-btn'),
    simulateBtn: document.getElementById('simulate-btn'),
    speedSlider: document.getElementById('speed-slider'),
    swapBtn: document.getElementById('swap-btn'),
    payload: document.getElementById('payload'),
    transitionTime: document.getElementById('transition-time'),
    stateLoss: document.getElementById('state-loss'),
    fps: document.getElementById('fps'),
    transitionOverlay: document.getElementById('transition-overlay'),
    estimatedTime: document.getElementById('estimated-time')
};


const networkTypes = {
    1: { name: '2G', speed: '200ms / 0.1 Mbps' },
    2: { name: '3G', speed: '72ms / 2.1 Mbps' },
    3: { name: '5G', speed: '28ms / 100 Mbps' }
};


const tiers = {
    'A': { name: 'A 🏢', payload: '570KB', color: '#4caf50' },
    'B': { name: 'B ⚡', payload: '225KB', color: '#2196f3' },
    'C': { name: 'C 🛡️', payload: '40KB', color: '#ff9800' },
    'D': { name: 'D 🔴', payload: '2KB', color: '#d32f2f' }
};


function init() {
    updateUI();
    setupEventListeners();
    

    if (autoMode) {
        setInterval(autoCheckEnvironment, 5000);
    }
}


function updateUI() {
    const battery = parseInt(elements.batterySlider.value);
    const network = parseInt(elements.networkSlider.value);
    

    elements.batteryLevel.textContent = battery;
    elements.batteryWarning.textContent = battery <= 20 ? 
        `⚠️ Critical (${battery}%)` : 
        battery <= 40 ? `Low (${battery}%)` : 
        `Normal (${battery}%)`;
    

    const networkType = networkTypes[network];
    elements.networkType.textContent = networkType.name;
    elements.networkDetails.textContent = networkType.speed;
    

    if (autoMode) {
        decideTier(battery, network);
    }
    

    updateMetrics();
}

function decideTier(battery, network) {
    let newTier;
    
    if (battery <= 10 || network === 1) {
        newTier = 'D';
    } else if (battery <= 30 || network === 2) {
        newTier = 'C';
    } else if (battery <= 60) {
        newTier = 'B';
    } else {
        newTier = 'A';
    }
    
   
    if (newTier !== currentTier) {
        transitionToTier(newTier);
    }
}


function transitionToTier(tier) {
    const transitionTime = (11 - elements.speedSlider.value) * 50; // 50-500ms
    
    
    elements.transitionOverlay.style.display = 'flex';
    elements.estimatedTime.textContent = `${transitionTime}ms`;
    
  
    saveUserState();
    

    setTimeout(() => {
   
        currentTier = tier;
        const tierConfig = tiers[tier];
        

        elements.currentTier.textContent = tierConfig.name;
        elements.currentTier.className = `tier-${tier.toLowerCase()}`;
        elements.currentTier.style.backgroundColor = tierConfig.color;
        elements.tierName.textContent = `TIER ${tier}`;
        

        updatePhoneMockup(tier);
        

        restoreUserState();

        setTimeout(() => {
            elements.transitionOverlay.style.display = 'none';
            

            logTransition(tier, transitionTime);
        }, 500);
    }, transitionTime);
}


function saveUserState() {
    userState = {
        email: elements.emailInput.value,
        password: elements.passwordInput.value,
        focusField: document.activeElement.id
    };
    

    elements.stateLoss.textContent = '0% ✓';
    elements.stateLoss.className = 'metric-value success';
}


function restoreUserState() {
    elements.emailInput.value = userState.email;
    elements.passwordInput.value = userState.password;
    
    if (userState.focusField && document.getElementById(userState.focusField)) {
        document.getElementById(userState.focusField).focus();
    }
}


function updatePhoneMockup(tier) {
    const mockup = document.querySelector('.phone-mockup');
    

    mockup.className = 'phone-mockup';
    

    mockup.classList.add(`tier-${tier.toLowerCase()}`);
    

    switch(tier) {
        case 'A':
            mockup.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
            mockup.style.borderColor = '#4caf50';
            break;
        case 'B':
            mockup.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.3)';
            mockup.style.borderColor = '#2196f3';
            break;
        case 'C':
            mockup.style.boxShadow = '0 8px 25px rgba(255, 152, 0, 0.3)';
            mockup.style.borderColor = '#ff9800';
            break;
        case 'D':
            mockup.style.boxShadow = '0 8px 25px rgba(211, 47, 47, 0.3)';
            mockup.style.borderColor = '#d32f2f';
            break;
    }
}


function updateMetrics() {
    const tierConfig = tiers[currentTier];
    
    elements.payload.textContent = tierConfig.payload;
    elements.transitionTime.textContent = `${(11 - elements.speedSlider.value) * 50}ms`;
    

    const battery = parseInt(elements.batterySlider.value);
    const network = parseInt(elements.networkSlider.value);
    const simulatedFPS = Math.min(60, 20 + (battery * 0.4) + (network * 13));
    elements.fps.textContent = `${Math.round(simulatedFPS)}/60`;
}


function logTransition(tier, time) {
    const log = {
        timestamp: new Date().toLocaleTimeString(),
        from: currentTier,
        to: tier,
        time: time,
        battery: elements.batterySlider.value,
        network: networkTypes[elements.networkSlider.value].name
    };
    
    console.log('Transition:', log);
}


function simulateDegradation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    elements.simulateBtn.textContent = 'SIMULATING...';
    elements.simulateBtn.disabled = true;
    
    let cycle = 15;
    const interval = setInterval(() => {

        const currentBattery = parseInt(elements.batterySlider.value);
        const newBattery = Math.max(5, currentBattery - 3);
        elements.batterySlider.value = newBattery;
        

        if (cycle % 3 === 0 && elements.networkSlider.value > 1) {
            elements.networkSlider.value--;
        }
        
        cycle++;
        elements.cycle.textContent = cycle;
        elements.progress.style.width = `${(cycle / 30) * 100}%`;
        
        updateUI();
        

        if (cycle >= 30) {
            clearInterval(interval);
            simulationRunning = false;
            elements.simulateBtn.textContent = 'SIMULATE DEGRADATION';
            elements.simulateBtn.disabled = false;
        }
    }, 1000);
}


function autoCheckEnvironment() {
    if (!autoMode) return;
    

    const battery = parseInt(elements.batterySlider.value);
    const network = parseInt(elements.networkSlider.value);
    

    const batteryChange = Math.random() > 0.5 ? -1 : 0;
    const newBattery = Math.max(5, Math.min(100, battery + batteryChange));
    
    elements.batterySlider.value = newBattery;
    updateUI();
}


function setupEventListeners() {

    elements.batterySlider.addEventListener('input', updateUI);
    elements.networkSlider.addEventListener('input', updateUI);
    elements.speedSlider.addEventListener('input', updateUI);
    

    elements.autoBtn.addEventListener('click', () => {
        autoMode = true;
        elements.autoBtn.classList.add('active');
        elements.manualBtn.classList.remove('active');
    });
    
    elements.manualBtn.addEventListener('click', () => {
        autoMode = false;
        elements.manualBtn.classList.add('active');
        elements.autoBtn.classList.remove('active');
    });
    

    elements.simulateBtn.addEventListener('click', simulateDegradation);
    

    elements.swapBtn.addEventListener('click', () => {

        const tierOrder = ['A', 'B', 'C', 'D'];
        const currentIndex = tierOrder.indexOf(currentTier);
        const nextIndex = (currentIndex + 1) % tierOrder.length;
        transitionToTier(tierOrder[nextIndex]);
    });
    

    elements.emailInput.addEventListener('input', () => saveUserState());
    elements.passwordInput.addEventListener('input', () => saveUserState());
    elements.emailInput.addEventListener('focus', () => saveUserState());
    elements.passwordInput.addEventListener('focus', () => saveUserState());
    
    elements.loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Login attempt with tier ${currentTier} interface\nEmail: ${elements.emailInput.value}`);
    });
    

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
       
            const tab = this.textContent;
            alert(`Switching to ${tab} view`);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .tier-a { background-color: #4caf50 !important; color: white; }
        .tier-b { background-color: #2196f3 !important; color: white; }
        .tier-c { background-color: #ff9800 !important; color: white; }
        .tier-d { background-color: #d32f2f !important; color: white; }
    `;
    document.head.appendChild(style);
    
  
    init();
});