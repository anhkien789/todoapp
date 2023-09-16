let label = $("label");
// console.log("label", label);
for (let index = 0; index < label.length; index++) {
  let input = label[index].querySelector("input");

  input.addEventListener("click", (event) => {
    // console.log(event.target.checked);
    if (event.target.checked) {
      //   $("h1").css("color", "red");
      label[index].querySelector("span").style.textDecoration = "line-through";
      label[index].querySelector("span").style.opacity = "0.5";
    } else {
      //   $("h1").css("color", "purple");
      label[index].querySelector("span").style.textDecoration = "none";
      label[index].querySelector("span").style.opacity = "1";
    }
  });

  //   console.log(input.hasAttribute("checked"));
  //   console.log("input", input);
}
