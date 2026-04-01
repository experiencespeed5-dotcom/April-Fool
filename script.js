let userData = {
  name: "",
  personality: "",
  strengths: "",
  weakness: ""
};

function startAnalysis() {
  const name = document.getElementById("name").value;
  const personality = document.getElementById("personality").value;
  const strengths = document.getElementById("strengths").value;

  const weaknessRadio = document.querySelector('input[name="weakness"]:checked');

  if (!name || !personality || !strengths || !weaknessRadio) {
    alert("Fill everything 😏");
    return;
  }

  userData = {
    name,
    personality,
    strengths,
    weakness: weaknessRadio.value
  };

  document.getElementById("page-1").classList.add("hidden");
  document.getElementById("page-2").classList.remove("hidden");

  showResult();
}

function showResult() {
  document.getElementById("result-name").innerText = userData.name;
  document.getElementById("result-personality").innerText = userData.personality;

  const strengthsList = document.getElementById("strengths-list");
  strengthsList.innerHTML = "";

  const items = userData.strengths.split(",");

  items.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    strengthsList.appendChild(li);
  });

  const funny = document.createElement("li");
  funny.innerText = "Hmmmm...Replies after 2 hours of overthinking!! 💬";
  strengthsList.appendChild(funny);

  const weaknessList = document.getElementById("weakness-list");
  weaknessList.innerHTML = "";

  const weaknesses = [
    userData.weakness,
    "Overthinks at 3 AM 🌙",
    "Says I'm fine but not 💀"
  ];

  weaknesses.forEach(w => {
    const li = document.createElement("li");
    li.innerText = w;
    weaknessList.appendChild(li);
  });
}

function showReport() {
  document.getElementById("page-2").classList.add("hidden");
  document.getElementById("page-3").classList.remove("hidden");
}
