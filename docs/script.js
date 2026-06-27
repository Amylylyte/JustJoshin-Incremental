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

// FC Names
const FCName = {
    0: "None",
    1: "Stricken",
    2: "Cliffs of Dover",
    3: "One",
    4: "TTFAF",
    5: "Soulless 3",
    6: "Wiiolation",
    7: "DNA Uber Solo 9",
    8: "Minds of The Mad 125%",
    9: "Dashed Hopes III",
    10: "Prevail",
    11: "Tramatic Carnival 115%",
    12: "Soulless 6 105%",
    13: "Prevail 115%",
    14: "Supernovae",
    15: "Supernovae 125",
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
        if (num.greaterThanOrEqualTo(1e9)) {
            return num.toExponential(2).replace("e+", "e");
        } else if (num.greaterThanOrEqualTo(1000)) {
            return num.toNumber().toLocaleString();
        } else if (num.isInteger()) {
            return num.toString();
        } else {
            return num.toNumber().toFixed(2).replace(/\.?0+$/, '');
        }
    } else {
        // Fallback for non-Decimal numbers
        if (num >= 1e9) {
            return num.toExponential(2).replace("e+", "e");
        } else if (num >= 1000) {
            return Math.floor(num).toLocaleString();
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

// Career Start
function CareerStart() {
    if (notesHit === 0) {
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
    const fcThreshold = new Decimal(1000)
        .pow(Decimal.pow(4/2.999, hardestFC))
        .floor();
    if (notesHit.greaterThan(fcThreshold)) {
        hardestFC += 1;
    }

    // Update FC-related values
    hardestFCBoost = Decimal.pow(1.5, hardestFC);
    notesForNextHardest = new Decimal(1000)
        .pow(Decimal.pow(4/3, hardestFC))
        .floor();
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
        );
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
