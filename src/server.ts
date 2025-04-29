import app from "./app";
import configs from "./configs";

const main = async () => {
  app.listen(configs.port, () => {
    console.log(`Example app listening on port ${configs.port}`);
  });
};
// check comments

main();
