let notesHit = 0;
let notesHitPerSecond = 0;
let hardestFCBoost = 0;  
let CareerStarted = 0;
let U1BOOST_ = 1;
let U1PRICE_ = 100;
let U1BOUGHT_ = 0;
let U1POWER_ = 1.2;
let U2BOOST_ = 1;
let U2PRICE_ = 1000;
let U2BOUGHT_ = 0;
let U2POWER_ = 3;
let U3BOOST_ = 1;
let U3PRICE_ = 1e30;
let U3BOUGHT_ = 0;
let U3POWER_ = 2;
let lastTime = 0;
let hardestFC = 0;
const FCName = {
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

function CareerStart() {
  if (notesHit == 0) {
    notesHit += 1;
    CareerStarted = 1;
  }
}

function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    console.log("DeltaTime:", deltaTime);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

function Upgrade1() {
  if (notesHit >= U1PRICE_) {
      notesHit -= U1PRICE_;
    }

    U1PRICE_ *= 1.25 * Math.pow(1.001, U1BOUGHT_);
    U1BOUGHT_ += 1;

  }
}
function Upgrade2() {
  if (notesHit >= U2PRICE_ && hardestFC >= 1) {
      notesHit -= U2PRICE_;
    U2BOUGHT_ += 1;
    U2PRICE_ *= 10 * Math.pow(1.01, U2BOUGHT_);
  }
}


function Upgrade3() {
  if (notesHit >= U3PRICE_ && hardestFC >= 3) {
      notesHit -= U3PRICE_;
    U3PRICE_ *= 5 * Math.pow(1.15, U3BOUGHT_);
    U3BOUGHT_ += 1;
  }
}

setInterval(function() {

  if (CareerStarted == 1) {
    notesHitPerSecond = 1 * hardestFCBoost * U1BOOST_ * U2BOOST_
  }
  
    notesHit += notesHitPerSecond * deltaTime;
    hardestFC = Math.floor(notesHit / (1000 * Math.Pow(4, hardestFC * Math.Pow(1.25, hardestFC))))
  hardestFCBoost = Math.Pow(1.5, hardestFC)
  
  }
  U1BOOST_ = Math.pow(U1POWER_, U1BOUGHT_)
  U2BOOST_ = Math.pow(U2POWER_, U2BOUGHT_)
  U3BOOST_ = Math.pow(U3POWER_, U3BOUGHT_)
  if (EntropyStarted == 0) {
    hardestFC = 0
  }
  if (notesHit < 1e3) {
    document.getElementById("NotesHit").innerHTML = notesHit.toFixed(2)
  }
  if (notesHit >= 1e3) {
    document.getElementById("NotesHit").innerHTML = notesHit.toExponential(2);
  }

  if (notesHitPerSecond < 1e3) {
    document.getElementById("NotesHitPerSecond").innerHTML = notesHitPerSecond.toFixed(2)
  }
  if (notesHitPerSecond >= 1e3) {
    document.getElementById("NotesHitPerSecond").innerHTML = notesHitPerSecond.toExponential(2);
  }
  document.getElementById("FCName").textContent = FCName[hardestFC];

  document.getElementById("Hardest").innerHTML = hardestFC.toFixed(2);
  document.getElementById("FCBoost").innerHTML = hardestFCBoost.toFixed(2);
  if (U1PRICE_ < 1e3) {
    document.getElementById("U1Price").innerHTML = U1PRICE_.toFixed(2)
  }
  if (U1PRICE_ >= 1e3) {
    document.getElementById("U1Price").innerHTML = U1PRICE_.toExponential(2);
  }
  if (U2PRICE_ <= 1e3) {
    document.getElementById("U2Price").innerHTML = U2PRICE_.toFixed(2)
  }
  if (U2PRICE_ > 1e3) {
    document.getElementById("U2Price").innerHTML = U2PRICE_.toExponential(2);
  }
  if (U3PRICE_ < 1e3) {
    document.getElementById("U3Price").innerHTML = U3PRICE_.toFixed(2)
  }
  if (U3PRICE_ >= 1e3) {
    document.getElementById("U3Price").innerHTML = U3PRICE_.toExponential(2);
  }
}, 25)
