// Game State
let notesHit = new Decimal(0);
let notesHitPerSecond = new Decimal(0);
let hardestFCBoost = new Decimal(0);
let CareerStarted = 0;
let U1BOOST_ = new Decimal(1);
let U1PRICE_ = new Decimal(25);
let U1BOUGHT_ = 0; // Integer, no need for Decimal
let U1POWER_ = 1.2; // Float, no need for Decimal
let U2BOOST_ = new Decimal(1);
let U2PRICE_ = new Decimal(500);
let U2BOUGHT_ = 0;
let U2POWER_ = 3;
let U3BOOST_ = new Decimal(1);
let U3PRICE_ = new Decimal("1e30");
let U3BOUGHT_ = 0;
let U3POWER_ = 1.25;
let lastTime = 0;
let hardestFC = 0; // Integer, no need for Decimal
let notesForNextHardest = new Decimal(0);
let clicks = 0; // Integer, no need for Decimal
let deltaTime = 0;
let pendingOvertap = new Decimal(0);
let OvertapPoints = new Decimal(0);

// FC Names
const FCName = {
    0: "None", 1: "Stricken", 2: "Cliffs of Dover", 3: "One", 4: "TTFAF", 5: "Soulless 3", 6: "Wiiolation", 7: "DNA Uber Solo 9", 8: "Minds of The Mad 125%",
    9: "Dashed Hopes III", 10: "Prevail", 11: "Tramatic Carnival 115%", 12: "Soulless 6 105%", 13: "Prevail 115%", 14: "Supernovae", 15: "Spacerace 90%",
    16: "Spacerace 95%", 17: "Supernovae 125%", 18: "Spacerace 100%", 19: "Schmootopia", 20: "Cosmic Embassy", 21: "Hypnovia", 22: "Uber Solo", 23: "Cosmic Embassy 125%", 24: "Egoless",
    25: "Egoless 125%", 26: "Uber Solo 2", 27: "Uber Solo 2 125%", 28: "Uber Solo 2 150%", 29: "Fully Soulless 1,000%", 30: "Egoless 1,000%", 31: "Uber Solo 2 1,000%",
    32: "Stricken 100,000%", 33: "One 1,000,000%", 34: "TTFAF 2,000,000%", 35: "Prevail 5,000,000%", 36: "Soulless 6 66,666,660%", 37: "Supernovae 125,125,125%",
    38: "Cosmic Embassy 2.5e9%", 39: "Hypnovia 1.7e14%", 40: "Uber Solo 1e19%", 41: "Fully Soulless 1.23e45%", 42: "Egoless 9.99e99%", 43: "Uber Solo 2 2.22e222%",
    44: "My Name is Jonas 5e525%", 45: "xXXi_wud_nvrstøp_ÜXXx (Remix) 3.33e999%", 46: "Glacial Storm 5 5.55e5,555%", 47: "Soulless 1337 1.3e13,370%", 48: "Supernovae 1.25e125,125%",
    49: "Schmootopia 1e567,890%", 50: "Act 9: Egoless 9.99e999,999,999%", 51: "Slow Ride"
};

// Reset Text Logic
const resetText = (hardestFC) => {
    if ([0, 1, 2, 3, 4].includes(hardestFC)) {
        return "FC Soulless 3 to unlock Overtap";
    } else if (hardestFC >= 5) {
        return "Josh realizes his speed is softlocked by his guitar, reset your progress to add Overtap to Josh's guitar.";
    }
    return "No reset message available.";
};

// Format Numbers
function formatNumber(num) {
    if (num instanceof Decimal) {
        // Handle extremely large numbers (e.g., 1e3027678)
        if (num.e >= 1000) {
            // Format the mantissa (e.g., "1.234")
            const mantissa = num.mantissa.toLocaleString(undefined, {
                maximumFractionDigits: 3,
                minimumFractionDigits: 0,
            });

            // Format the exponent with commas (e.g., "3,027,678")
            const formattedExponent = num.e.toLocaleString();

            // Combine them
            return `${mantissa}e${formattedExponent}`;
        }
        // Handle numbers >= 1e9
        else if (num.greaterThanOrEqualTo(1e9)) {
            const coefficient = num.div(Decimal.pow(10, num.e));
            const formattedCoefficient = coefficient.toNumber().toLocaleString();
            return `${formattedCoefficient}e${num.e}`;
        }
        // Handle numbers >= 1000
        else if (num.greaterThanOrEqualTo(1000)) {
            return num.toNumber().toLocaleString();
        }
        // Handle integers
        else if (num.eq(num.floor())) {
            return num.toString();
        }
        // Handle decimals
        else {
            return num.toNumber().toFixed(2).replace(/\.?0+$/, '');
        }
    } else {
        // Fallback for non-Decimal numbers
        if (num >= 1e9) {
            const parts = num.toExponential(2).split('e');
            const coefficient = parseFloat(parts).toLocaleString();
            const exponent = parseInt(parts, 10).toLocaleString();
            return `${coefficient}e${exponent}`;
        } else if (num >= 1000) {
            return num.toLocaleString();
        } else if (Number.isInteger(num)) {
            return num.toString();
        } else {
            return num.toFixed(2).replace(/\.?0+$/, '');
        }
    }
}





// Update Overtap Button Visibility and Text
function updateOvertapButton() {
    const overtapButton = document.getElementById("OvertapButton");
    const overtapButtonText = document.getElementById("OvertapButtonText");

    if (hardestFC >= 3) {
        overtapButton.style.display = "block";
        overtapButton.disabled = false;
        overtapButtonText.textContent =
            resetText(hardestFC) +
            " (" +
            formatNumber(pendingOvertap) +
            ")";
    } else {
        overtapButton.style.display = "none";
        overtapButton.disabled = true;
    }
}
function updateHeaderButtons() {
    const headerButtons = document.getElementById("tab-button");

    if (hardestFC >= 3) {
        headerButtons.style.display = "block";
        headerButtons.disabled = false;
    } else {
        headerButtons.style.display = "none";
        headerButtons.disabled = true;
    }
}

// Career Start
function CareerStart() {
    if (notesHit.equals(0)) {  // Use .equals() for Decimal objects
        CareerStarted = 1;
    }
    clicks += 1;
}

// Upgrades
function Upgrade1() {
    if (notesHit.greaterThanOrEqualTo(U1PRICE_)) {
        notesHit = notesHit.minus(U1PRICE_);
        U1BOUGHT_ += 1;
        U1PRICE_ = U1PRICE_
            .times(1.25)
            .times(Decimal.pow(1.01, U1BOUGHT_))
            .floor();
        U1BOOST_ = Decimal.pow(U1POWER_, U1BOUGHT_);
    }
}

function Upgrade2() {
    if (notesHit.greaterThanOrEqualTo(U2PRICE_) && hardestFC >= 1) {
        notesHit = notesHit.minus(U2PRICE_);
        U2BOUGHT_ += 1;
        U2PRICE_ = U2PRICE_
            .times(10)
            .times(Decimal.pow(1.02, U2BOUGHT_))
            .floor();
        U2BOOST_ = Decimal.pow(U2POWER_, U2BOUGHT_);
    }
}

function Upgrade3() {
    if (notesHit.greaterThanOrEqualTo(U3PRICE_) && hardestFC >= 3) {
        notesHit = notesHit.minus(U3PRICE_);
        U3BOUGHT_ += 1;
        U3PRICE_ = U3PRICE_
            .times(5)
            .times(Decimal.pow(1.15, U3BOUGHT_))
            .floor();
        U3BOOST_ = Decimal.pow(U3POWER_, U3BOUGHT_);
    }
}

// Overtap Reset
function OvertapReset() {
    notesHit = new Decimal(0);
    hardestFC = 0;
    OvertapPoints = Overtap.plus(pendingOvertap);
    pendingOvertap = new Decimal(0);
    updateOvertapButton();
}

// Animation Loop
function animate(currentTime) {
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Main Game Loop
setInterval(function() {
    if (CareerStarted === 1) {
        notesHitPerSecond = new Decimal(1)
            .times(hardestFCBoost)
            .times(U1BOOST_)
            .times(U2BOOST_)
            .times(Decimal.pow(Decimal.log10(clicks + 9), U3BOOST_));
    }

    notesHit = notesHit.plus(notesHitPerSecond.times(deltaTime));

    // Check for new FC
    if (notesHit.greaterThan(notesForNextHardest)) {
        hardestFC += 1;
    }

    // Update FC-related values
    hardestFCBoost = Decimal.pow(1.5, hardestFC);
    if (hardestFC < 17) {
    notesForNextHardest = new Decimal(1000)
        .pow(Decimal.pow(1.335785623, hardestFC || 0))
        .floor();
} else if (hardestFC >= 17) {
    notesForNextHardest = new Decimal("1.8e308")
        .pow(Decimal.pow(2.4321, (hardestFC || 0) - 16))
        .floor();
}
        
    U1BOOST_ = Decimal.pow(U1POWER_, U1BOUGHT_);
    U2BOOST_ = Decimal.pow(U2POWER_, U2BOUGHT_);
    U3BOOST_ = Decimal.pow(U3POWER_, U3BOUGHT_);

    if (CareerStarted === 0) {
        hardestFC = 0;
    }

    // Calculate pendingOvertap
    if (hardestFC >= 5) {
        pendingOvertap = Decimal.pow(
            10,
            Decimal.div(Decimal.log10(notesHit.div(3.03e9)), 9)
        ).floor();
        OvertapButton.disabled = false;
    } else if (hardestFC < 5) {
        pendingOvertap = new Decimal(0);
        OvertapButton.disabled = true;
    }

    // Update UI
    document.getElementById("NotesHit").textContent = formatNumber(notesHit);
    document.getElementById("NotesHitPerSecond").textContent = formatNumber(notesHitPerSecond);
    document.getElementById("FCName").textContent = FCName[hardestFC];
    document.getElementById("NotesForNextFC").textContent = formatNumber(notesForNextHardest);
    document.getElementById("FCBoost").textContent = formatNumber(hardestFCBoost);
    document.getElementById("U1Price").textContent = formatNumber(U1PRICE_);
    document.getElementById("U2Price").textContent = formatNumber(U2PRICE_);
    document.getElementById("U3Price").textContent = formatNumber(U3PRICE_);

    // Update Overtap Button
    updateOvertapButton();
}, 25);
