 let notesHit = 0;
        let notesPerSecond = 1;
        let upgrades = [];

        const clickerButton = document.getElementById("clicker-button");
        const statsElement = document.getElementById("stats");
        const upgradeButtons = document.querySelectorAll(".upgrade");

        function updateUI() {
            statsElement.textContent = `Points: ${points.toFixed(1)}`;
        }

        clickerButton.addEventListener("click", () => {
            notesHit += 1;
            updateUI();
        });

        upgradeButtons.forEach(button => {
            button.addEventListener("click", () => {
                const cost = parseFloat(button.dataset.cost);
                const boost = parseFloat(button.dataset.income);

                if (notesHit >= cost) {
                    notesHit -= cost;
                    upgrades.push({ boost: boost });
                    button.disabled = true;
                    button.textContent = `Bought! (Boost: +${boost}/s)`;
                    updateUI();
                } else {
                    alert("Not enough points!");
                }
            });
        });

        // Auto-income loop
        setInterval(() => {
            if (upgrades.length > 0) {
                const totalIncome = upgrades.reduce((sum, upgrade) => sum + upgrade.income, 0);
                points += totalIncome;
                updateUI();
            }
        }, 1000);

