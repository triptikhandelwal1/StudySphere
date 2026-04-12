let hours = localStorage.getItem("studyHours") || 0;

function addStudyTime(minutes){

hours = parseFloat(hours) + minutes/60;

localStorage.setItem("studyHours", hours);

document.getElementById("studyHours").textContent = hours.toFixed(2);

updateWeeklyData(minutes);

}

function saveNotes() {
  const notes = document.getElementById("notesInput").value;
  localStorage.setItem("notes", notes);
  alert("Notes saved!");
}

function loadNotes() {
  const saved = localStorage.getItem("notes");
  if (saved) {
    document.getElementById("notesInput").value = saved;
  }
}

loadNotes();

function uploadNote(){

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if(!file){
    alert("Please select a file");
    return;
  }

  localStorage.setItem("uploadedFileName", file.name);

  document.getElementById("fileName").innerText = "Uploaded: " + file.name;
}

