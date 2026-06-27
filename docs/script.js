// Game State
let notesHit = new Decimal(0);
let notesHitPerSecond = new Decimal(0);
let hardestFCBoost = new Decimal(0);
let CareerStarted = 0;
let U1BOOST_ = new Decimal(1);
let U1PRICE_ = new Decimal(25);
let U1BOUGHT_ = 0; // Integer, no need for Decimal
let U1POWER_ = new Decimal(1.2); // Float, no need for Decimal
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
let OvertapsPerformed = new Decimal(0);
let OvertapsBoost = new Decimal(0);
let OU1Purchased = 0;
let OU2Purchased = 0;
let OU3Purchased = 0;
let OU4Purchased = 0;
let OU5Purchased = 0;
let OU6Purchased = 0;
let OU7Purchased = 0;
let OU8Purchased = 0;
let OU1Boost = new Decimal(1);
let OU2Boost = new Decimal(1);
let OU3Boost = new Decimal(1);
let OU5Boost = new Decimal(1);
let OU7Boost = new Decimal(1);
let OU8Boost = new Decimal(1);
let timePlayed = new Decimal(0);

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

    if (hardestFC >= 5) {
        overtapButton.style.display = "block";
        overtapButton.disabled = false;
        overtapButton.style.backgroundColor = "#95e347";
        overtapButtonText.textContent =
            resetText(hardestFC) +
            " (+" +
            formatNumber(pendingOvertap) +
            " Overtap Points)";
    }
    else if (hardestFC >= 3 && hardestFC < 5) {
        overtapButton.style.display = "block";
        overtapButton.disabled = true;
        overtapButton.style.backgroundColor = "#70964c";
        overtapButtonText.textContent =
            resetText(hardestFC)
    } else {
        overtapButton.style.display = "none";
        overtapButton.disabled = true;
    }
}
function updateHeaderButtons() {
    const headerButtons = document.querySelectorAll(".tab-button");

    headerButtons.forEach(button => {
        if (hardestFC >= 3 || OvertapsPerformed.greaterThanOrEqualTo(1)) {
            button.style.display = "block";
            button.disabled = false;
        }
    });
}

function updateOvertapUpgradeButtons() {
    const overtapUpgrade1Button = document.getElementById("OvertapUpgrade1");
    const overtapUpgrade2Button = document.getElementById("OvertapUpgrade2");
    const overtapUpgrade3Button = document.getElementById("OvertapUpgrade3");
    const overtapUpgrade4Button = document.getElementById("OvertapUpgrade4");
    const overtapUpgrade5Button = document.getElementById("OvertapUpgrade5");
    const overtapUpgrade6Button = document.getElementById("OvertapUpgrade6");
    const overtapUpgrade7Button = document.getElementById("OvertapUpgrade7");
    const overtapUpgrade8Button = document.getElementById("OvertapUpgrade8");
    const overtapUpgrade1Text = document.getElementById("OvertapUpgrade1Text");
    const overtapUpgrade2Text = document.getElementById("OvertapUpgrade2Text");
    const overtapUpgrade3Text = document.getElementById("OvertapUpgrade3Text");
    const overtapUpgrade4Text = document.getElementById("OvertapUpgrade4Text");
    const overtapUpgrade5Text = document.getElementById("OvertapUpgrade5Text");
    const overtapUpgrade6Text = document.getElementById("OvertapUpgrade6Text");
    const overtapUpgrade7Text = document.getElementById("OvertapUpgrade7Text");
    const overtapUpgrade8Text = document.getElementById("OvertapUpgrade8Text");

    if (OU1Purchased == 0) {
        overtapUpgrade1Button.style.backgroundColor = "#cccccc";
        overtapUpgrade1Button.disabled = false;
        overtapUpgrade1Text.textContent =
            "(Price: 1 Overtap Point)";
        OU1Boost = new Decimal(1);
    }
    if (OU2Purchased == 0) {
        overtapUpgrade2Button.style.backgroundColor = "#cccccc";
        overtapUpgrade2Button.disabled = false;
        overtapUpgrade2Text.textContent =
            "(Price: 10 Overtap Points)";
        OU2Boost = new Decimal(1);
    }
    if (OU3Purchased == 0) {
        overtapUpgrade3Button.style.backgroundColor = "#cccccc";
        overtapUpgrade3Button.disabled = false;
        overtapUpgrade3Text.textContent =
            "(Price: 250 Overtap Points)";
        OU3Boost = new Decimal(1);
    }
    if (OU4Purchased == 0) {
        overtapUpgrade4Button.style.backgroundColor = "#cccccc";
        overtapUpgrade4Button.disabled = false;
        overtapUpgrade4Text.textContent =
            "(Price: 25 Overtap Points)";
    }
    if (OU5Purchased == 0) {
        overtapUpgrade5Button.style.backgroundColor = "#cccccc";
        overtapUpgrade5Button.disabled = false;
        overtapUpgrade5Text.textContent =
            "(Price: 500 Overtap Points)";
        OU5Boost = new Decimal(1);
    }
    if (OU6Purchased == 0) {
        overtapUpgrade6Button.style.backgroundColor = "#cccccc";
        overtapUpgrade6Button.disabled = false;
        overtapUpgrade6Text.textContent =
            "(Price: 6,250 Overtap Points)";
    }
    if (OU7Purchased == 0) {
        overtapUpgrade7Button.style.backgroundColor = "#cccccc";
        overtapUpgrade7Button.disabled = false;
        overtapUpgrade7Text.textContent =
            "(Price: 100,000 Overtap Points)";
        OU7Boost = new Decimal(1);
    }
    if (OU8Purchased == 0) {
        overtapUpgrade8Button.style.backgroundColor = "#cccccc";
        overtapUpgrade8Button.disabled = false;
        overtapUpgrade8Text.textContent =
            "(Price: 1e10 Overtap Points)";
        OU8Boost = new Decimal(1);
    }
    if (OU1Purchased == 1) {
        overtapUpgrade1Button.style.backgroundColor = "#95e347";
        overtapUpgrade1Text.textContent =
            "Currently: x" + formatNumber(OU1Boost);
        OU1Boost = new Decimal(1).times(new Decimal(1.5).pow(((timePlayed.div(60)).plus(1)).log2()));
    }
    if (OU2Purchased == 1) {
        overtapUpgrade2Button.style.backgroundColor = "#95e347";
        overtapUpgrade2Text.textContent =
            "Currently: x" + formatNumber(OU2Boost);
        OU2Boost = new Decimal(1).times(new Decimal(1.145).pow(((notesHit).plus(1)).log10()));
    }
    if (OU3Purchased == 1) {
        overtapUpgrade3Button.style.backgroundColor = "#95e347";
        overtapUpgrade3Text.textContent =
            "";
        OU3Boost = new Decimal(0.8);
    }
    if (OU4Purchased == 1) {
        overtapUpgrade4Button.style.backgroundColor = "#95e347";
        overtapUpgrade4Text.textContent =
            "";
    }
    if (OU5Purchased == 1) {
        overtapUpgrade5Button.style.backgroundColor = "#95e347";
        overtapUpgrade5Text.textContent =
            "Currently: ^" + formatNumber(OU5Boost);
        OU5Boost = new Decimal(5).minus((new Decimal(4).times(new Decimal(0.95).pow((OvertapPoints.add(new Decimal(1))).log10()))));
    }
    if (OU6Purchased == 1) {
        overtapUpgrade6Button.style.backgroundColor = "#95e347";
        overtapUpgrade6Text.textContent =
            "";
    }
    if (OU7Purchased == 1) {
        overtapUpgrade7Button.style.backgroundColor = "#95e347";
        overtapUpgrade7Text.textContent =
        "Currently: x" + formatNumber(OU5Boost);
        OU7Boost = new Decimal(1.05).pow((OvertapsPerformed.plus(1)).log10());
    }
    if (OU8Purchased == 1) {
        overtapUpgrade8Button.style.backgroundColor = "#95e347";
        overtapUpgrade8Text.textContent =
        "Currently: x" + formatNumber(OU5Boost);
        OU8Boost = new Decimal(1.05).pow((U1BOOST_.plus(1)).log10());
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
        if (OU6Purchased == 0) {
        notesHit = notesHit.minus(U1PRICE_);
        }
        U1BOUGHT_ += 1;
    }
}

function Upgrade2() {
    if (notesHit.greaterThanOrEqualTo(U2PRICE_) && hardestFC >= 1) {
        if (OU6Purchased == 0) {
        notesHit = notesHit.minus(U2PRICE_);
        }
        U2BOUGHT_ += 1;
    }
}

function Upgrade3() {
    if (notesHit.greaterThanOrEqualTo(U3PRICE_) && hardestFC >= 3) {
        if (OU6Purchased == 0) {
        notesHit = notesHit.minus(U3PRICE_);
        }
        U3BOUGHT_ += 1;
        
    }
}

function OvertapUpgrade1() {
    if (OvertapPoints.greaterThanOrEqualTo(1) && OU1Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(1);
        OU1Purchased = 1;
    }
}
function OvertapUpgrade2() {
    if (OvertapPoints.greaterThanOrEqualTo(10) && OU2Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(10);
        OU2Purchased = 1;
    }
}
function OvertapUpgrade3() {
    if (OvertapPoints.greaterThanOrEqualTo(250) && OU3Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(250);
        OU3Purchased = 1;
    }
}
function OvertapUpgrade4() {
    if (OvertapPoints.greaterThanOrEqualTo(25) && OU4Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(25);
        OU4Purchased = 1;
    }
}
function OvertapUpgrade5() {
    if (OvertapPoints.greaterThanOrEqualTo(500) && OU5Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(500);
        OU5Purchased = 1;
    }
}
function OvertapUpgrade6() {
    if (OvertapPoints.greaterThanOrEqualTo(6250) && OU6Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(6250);
        OU6Purchased = 1;
    }
}
function OvertapUpgrade7() {
    if (OvertapPoints.greaterThanOrEqualTo(1e5) && OU7Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(1e5);
        OU7Purchased = 1;
    }
}
function OvertapUpgrade8() {
    if (OvertapPoints.greaterThanOrEqualTo(1e10) && OU8Purchased == 0) {
        OvertapPoints = OvertapPoints.minus(1e10);
        OU8Purchased = 1;
    }
}

// Overtap Reset
function OvertapReset() {
    U1BOUGHT_ = 0;
    U2BOUGHT_ = 0;
    U3BOUGHT_ = 0;
    hardestFC = 0;
    clicks = 1;
    CareerStarted = 0;
    notesHitPerSecond = new Decimal(1);
    notesHit = new Decimal(0);
    OvertapPoints = OvertapPoints.plus(pendingOvertap);
    pendingOvertap = new Decimal(0);
    OvertapsPerformed = OvertapsPerformed.plus((new Decimal(1).times(OU8Boost)));
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
            .times(Decimal.pow(Decimal.log2(clicks + 1), 1.25))
            .times(OvertapsBoost)
            .times(OU1Boost)
            .times(OU2Boost);
            notesHit = notesHit.plus(notesHitPerSecond.times(deltaTime));
    }
    timePlayed = timePlayed.plus(new Decimal(1).times(deltaTime));


    // Check for new FC
    if (notesHit.greaterThan(notesForNextHardest)) {
        hardestFC += 1;
    }

    // Update FC-related values
    hardestFCBoost = Decimal.pow(1.5, hardestFC).times(U3BOOST_).pow(OU5Boost);
    if (hardestFC < 17) {
    notesForNextHardest = new Decimal(1000)
        .pow(Decimal.pow(1.335785623, hardestFC || 0))
        .floor();
} else if (hardestFC >= 17) {
    notesForNextHardest = new Decimal("1.8e308")
        .pow(Decimal.pow(2.4321, (hardestFC || 0) - 16))
        .floor();
}
        
    U1BOOST_ = Decimal.pow((U1POWER_).times(OU7Boost), U1BOUGHT_);
    U2BOOST_ = Decimal.pow(U2POWER_, U2BOUGHT_);
    U3BOOST_ = Decimal.pow(U3POWER_, U3BOUGHT_);
    U1PRICE_ = new Decimal(25)
            .times(Decimal.pow(1.2, U1BOUGHT_))
            .pow(Decimal.pow(new Decimal(1).plus((new Decimal(0.015).times(OU3Boost))), U1BOUGHT_))
            .pow(OU3Boost)
            .floor();
    U2PRICE_ = new Decimal(1000)
            .times(Decimal.pow(5, U2BOUGHT_))
            .pow(Decimal.pow(new Decimal(1).plus((new Decimal(0.05).times(OU3Boost))), U2BOUGHT_))
            .pow(OU3Boost)
            .floor();
    U3PRICE_ = new Decimal(1e30)
            .times(Decimal.pow(4, U3BOUGHT_))
            .pow(Decimal.pow(new Decimal(1).plus((new Decimal(0.03).times(OU3Boost))), U3BOUGHT_))
            .floor();

    if (CareerStarted === 0) {
        hardestFC = 0;
    }

    // Calculate pendingOvertap
    if (hardestFC >= 5) {
        pendingOvertap = Decimal.pow(
            10,
            Decimal.div(Decimal.log10(notesHit.div(3.03e9)), 8)
        ).floor();
        OvertapButton.disabled = false;
    } else if (hardestFC < 5) {
        pendingOvertap = new Decimal(0);
        OvertapButton.disabled = true;
    }
    

    OvertapsBoost = (OvertapsPerformed.plus(1)).pow(2)

    if (OvertapsPerformed >= 10) {
        CareerStarted = 1;
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
    document.getElementById("overtapPoints").textContent = formatNumber(OvertapPoints);
    document.getElementById("overtapsPerformed").textContent = formatNumber(OvertapsPerformed);
    document.getElementById("overtapsBoost").textContent = formatNumber(OvertapsBoost);

    // Update Overtap Button
    if (OU4Purchased == 1) {
        Upgrade1();
        Upgrade2();
    }
    updateOvertapButton();
    updateOvertapUpgradeButtons();
    updateHeaderButtons();
}, 25);
