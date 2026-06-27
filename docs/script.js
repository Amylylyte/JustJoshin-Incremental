let notesHit = 0;
let notesHitPerSecond = 0;
let hardestFCBoost = 0;  
let CareerStarted = 0;
let U1BOOST_ = 1;
let U1PRICE_ = 25;
let U1BOUGHT_ = 0;
let U1POWER_ = 1.2;
let U2BOOST_ = 1;
let U2PRICE_ = 500;
let U2BOUGHT_ = 0;
let U2POWER_ = 3;
let U3BOOST_ = 1;
let U3PRICE_ = 1e30;
let U3BOUGHT_ = 0;
let U3POWER_ = 1.25;
let lastTime = 0;
let hardestFC = 0;
let notesForNextHardest = 0;
let clicks = 0;
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
    15: "Supernovae 125%",
};
const resetText = (hardestFC) => {
    if (hardestFC < 5) {
        return "FC Soulless 3 to unlock Overtap";
    } else if (hardestFC >= 5) {
        return "Josh realizes his speed is softlocked by his guitar, reset your progress to add Overtap to Josh's guitar.";
    }
};
let deltaTime = 0;
let pendingOvertap = 0

function CareerStart() {
  if (notesHit == 0) {
    CareerStarted = 1;
  }
    clicks += 1;
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return num.toExponential(2).replace("e+", "e");
    }
    else if (num >= 1000) {
        return Math.floor(num).toLocaleString();
    } else if (Number.isInteger(num)) {
        return num.toString(); // No decimals for integers
    } else {
        return num.toFixed(2); // Up to 2 decimals, remove trailing zeros
    }
}

function animate(currentTime) {
    deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

function Upgrade1() {
  if (notesHit >= U1PRICE_) {
      notesHit -= U1PRICE_;
    }

    U1PRICE_ *= 1.25 * Math.pow(1.01, U1BOUGHT_);
    U1BOUGHT_ += 1;

  }

function Upgrade2() {
  if (notesHit >= U2PRICE_ && hardestFC >= 1) {
      notesHit -= U2PRICE_;
    U2BOUGHT_ += 1;
    U2PRICE_ *= 10 * Math.pow(1.02, U2BOUGHT_);
  }
}


function Upgrade3() {
  if (notesHit >= U3PRICE_ && hardestFC >= 3) {
      notesHit -= U3PRICE_;
    U3PRICE_ *= 5 * Math.pow(1.15, U3BOUGHT_);
    U3BOUGHT_ += 1;
  }
}
function updateButtonVisibility() {
    if (notesHit >= 1e6) {
        document.getElementById("OvertapButton").style.display = "block";
    }
}

setInterval(function() {

  if (CareerStarted == 1) {
    notesHitPerSecond = 1 * hardestFCBoost * U1BOOST_ * U2BOOST_ *  Math.pow(Math.log10(clicks + 9), U3BOOST_)
  }
  
    notesHit += notesHitPerSecond * deltaTime;
    if (notesHit > Math.floor(Math.pow(1000, 1 * Math.pow(4/2.999, hardestFC)))) {
        hardestFC += 1;
    }
  hardestFCBoost = Math.pow(1.5, hardestFC)
  notesForNextHardest = Math.floor(Math.pow(1000, 1 * Math.pow(4/3, hardestFC))) ;
  U1BOOST_ = Math.pow(U1POWER_, U1BOUGHT_)
  U2BOOST_ = Math.pow(U2POWER_, U2BOUGHT_)
  U3BOOST_ = Math.pow(U3POWER_, U3BOUGHT_)
  if (CareerStarted == 0) {
    hardestFC = 0
  }
  if (hardestFC >= 5) {
      pendingOvertap = Math.pow(10, (Math.log10(notesHit/3.03e9)/9))
  }
document.getElementById("NotesHit").innerHTML = formatNumber(notesHit);
document.getElementById("NotesHitPerSecond").innerHTML = formatNumber(notesHitPerSecond);
document.getElementById("FCName").textContent = FCName[hardestFC];
document.getElementById("NotesForNextFC").innerHTML = formatNumber(notesForNextHardest);
document.getElementById("FCBoost").innerHTML = formatNumber(hardestFCBoost);
document.getElementById("U1Price").innerHTML = formatNumber(U1PRICE_);
document.getElementById("U2Price").innerHTML = formatNumber(U2PRICE_);
document.getElementById("U3Price").innerHTML = formatNumber(U3PRICE_);
document.getElementById("ResetText").textContent = resetText[hardestFC];
document.getElementById("PendingOvertap").innerHTML = formatNumber(pendingOvertap);
    updateButtonVisibility();
}, 25)
