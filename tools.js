document.addEventListener("DOMContentLoaded", () => {

  // ================= SELECT ELEMENTS =================
  const textarea = document.getElementById("notesInput");
  const saveBtn = document.getElementById("saveNoteBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const fileNameText = document.getElementById("fileName");
  const fileViewer = document.getElementById("fileViewer");

  // ================= SAVE NOTE =================
  saveBtn.addEventListener("click", async () => {
    const content = textarea.value;

    if (!content) {
      alert("Write something first ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      console.log("Saved:", data);

      alert("Note saved ✅");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving note ❌");
    }
  });

  // ================= LOAD DATA =================
  async function loadData() {
    try {
      const res = await fetch("http://localhost:5000/api/notes");
      const note = await res.json();

      if (note && note.content !== undefined) {
        textarea.value = note.content;
      }

      // ================= FILE LIST =================
      const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
      const studyData = JSON.parse(localStorage.getItem("studyData")) || {};

      let html = "";

      savedFiles.forEach(file => {
        const time = studyData[file] || 0;

        html += `
          <div style="margin-bottom:8px;">
            <span style="cursor:pointer;color:blue;" onclick="openFile('${file}')">
              📂 ${file}
            </span>

            <span style="margin-left:10px;color:green;">
              ⏱ ${time}s
            </span>

            <button onclick="deleteFile('${file}')" 
              style="margin-left:10px;color:red;border:none;background:none;cursor:pointer;">
              ❌
            </button>
          </div>
        `;
      });

      fileNameText.innerHTML = html;

    } catch (error) {
      console.error("Load error:", error);
    }
  }

  loadData();

  // ================= FILE UPLOAD =================
  uploadBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];

    if (!file) {
      alert("Choose a file first ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/notes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const fileUrl = "http://localhost:5000/uploads/" + data.fileName;

      fileViewer.innerHTML = `
        <iframe src="${fileUrl}" style="width:100%; height:80vh;"></iframe>
      `;

      // save file list
      let files = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
      files.push(data.fileName);
      localStorage.setItem("uploadedFiles", JSON.stringify(files));

      loadData();

      // ================= TRACK TIME =================
      currentFile = data.fileName;
      startTime = Date.now();
      startTimer();

      alert("File uploaded ✅");

    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed ❌");
    }
  });

});

// ================= OPEN FILE =================
function openFile(file) {
  const fileUrl = "http://localhost:5000/uploads/" + file;

  document.getElementById("fileViewer").innerHTML = `
    <iframe src="${fileUrl}" style="width:100%; height:80vh;"></iframe>
  `;

  // ================= TRACK TIME =================
  currentFile = file;
  startTime = Date.now();
  startTimer();
}

// ================= DELETE FILE =================
function deleteFile(file) {

  // remove from file list
  let files = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
  files = files.filter(f => f !== file);
  localStorage.setItem("uploadedFiles", JSON.stringify(files));

  // remove study time
  let studyData = JSON.parse(localStorage.getItem("studyData")) || {};
  delete studyData[file];
  localStorage.setItem("studyData", JSON.stringify(studyData));

  // refresh UI
  location.reload();
}