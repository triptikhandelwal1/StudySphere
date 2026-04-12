let today = new Date().toDateString();

let lastDate = localStorage.getItem("lastStudyDate");

let streak = parseInt(localStorage.getItem("streak")) || 0;

if(lastDate !== today){

streak++;

localStorage.setItem("streak", streak);

localStorage.setItem("lastStudyDate", today);

}

