function findArtifacts() {
  const checkbox = document.getElementById("findArtifacts");
  localStorage.setItem("findArtifacts", checkbox.checked);
}