let weatherIcons = {}; // defineres som objekt
let backgroundImages = {};

function preload()
{
  let iconNames = ["01d", "01n", "02d", "02n", "03d", "03n", "04", "05d", "05n", "06d", "06n", "07d", "07n", "08d", "08n", "09", "10", "11", "12", "13", "14", "15", "20d", "20n", "21d", "21n", "22", "23", "24d", "24n", "25d", "25n", "26d", "26n", "27d", "27n", "28d", "28n", "29d", "29n", "30", "31", "32", "33", "34", "40d", "40n", "41d", "41n", "42d", "42n", "43d", "43n", "44d", "44n", "45d", "45n", "46", "47", "48", "49", "50"];
  for (let i = 0; i < 62; i++)
  {
    weatherIcons[iconNames[i]] = loadImage("assets/icons/" + iconNames[i] + ".png");
  }

  backgroundImages =
  {
    running: loadImage("assets/backgrounds/running.png"),
    rowing: loadImage("assets/backgrounds/rowing.png"),
    football: loadImage("assets/backgrounds/football.png")
  }
}
