import { writeFile, readFile } from "fs";

const path = "./session/js/SessionInfo.json";

readFile(path, (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  const parsedData = JSON.parse(data);
  console.log(parsedData.Session1.Users.Player1);

  /*
  writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    console.log("Updated file successfully");
  });
  */
});