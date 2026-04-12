let startTime = null;
let timerInterval = null;
let currentFile = null;

// ================= DISPLAY TIMER =================
function updateTimerDisplay(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${mins}:${secs}`;
}

// ================= START TIMER =================
function startTimer() {
  if (timerInterval) return;

  startTime = Date.now();

  timerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    updateTimerDisplay(elapsed);
  }, 1000);
}

// ================= STOP + SAVE =================
async function stopTimer() {

  if (!startTime) {
    alert("Start timer first!");
    return;
  }

  clearInterval(timerInterval);
  timerInterval = null;

  const endTime = Date.now();
  const seconds = Math.floor((endTime - startTime) / 1000);

  // reset timer UI
  updateTimerDisplay(0);
  startTime = null;

  // ================= REAL SAVE LOGIC =================
  const minutes = seconds / 60;

  let hours = parseFloat(localStorage.getItem("studyHours")) || 0;

  hours += minutes / 60;

  hours = parseFloat(hours.toFixed(2));

  localStorage.setItem("studyHours", hours);

  // ✅ UPDATE UI IMMEDIATELY
  if (typeof updateTotalHours === "function") {
    updateTotalHours();
  }

  alert("Study time saved ✅");
}
// save real study time
let hours = parseFloat(localStorage.getItem("studyHours")) || 0;

hours += minutes / 60;
hours = parseFloat(hours.toFixed(2));

localStorage.setItem("studyHours", hours);
updateTotalHoursDisplay();
  // ================= SAVE STUDY TIME =================
if (typeof startTime !== "undefined" && typeof currentFile !== "undefined" && currentFile) {

  let studyData = JSON.parse(localStorage.getItem("studyData")) || {};

  if (!studyData[currentFile]) {
    studyData[currentFile] = 0;
  }

  studyData[currentFile] += seconds;

  localStorage.setItem("studyData", JSON.stringify(studyData));

  console.log("Saved study time:", studyData);
}

  updateTimerDisplay(0);
  startTime = null;
  

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const tasks = await res.json();

    if (!tasks.length) {
      alert("No tasks found. Add a task first.");
      return;
    }

    const taskId = tasks[0]._id;

    await fetch(`http://localhost:5000/api/tasks/${taskId}/time`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ time: seconds })
    });

    alert(`✅ Study time saved: ${seconds} seconds`);
    
if (startTime && currentFile) {
  const endTime = new Date();
  const timeSpent = Math.floor((endTime - startTime) / 1000);

  let studyData = JSON.parse(localStorage.getItem("studyData")) || {};

  if (!studyData[currentFile]) {
    studyData[currentFile] = 0;
  }

  studyData[currentFile] += timeSpent;

  localStorage.setItem("studyData", JSON.stringify(studyData));

  console.log("Saved study time:", studyData);
}

  } catch (err) {
    console.error("Timer error:", err);
  }
  window.startTimer = startTimer;
  window.stopTimer = stopTimer;