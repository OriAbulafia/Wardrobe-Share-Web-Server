import initApp from "./server";
const port = process.env.PORT || 3000; // Use the PORT provided by Render or fallback to 3000

initApp()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Error starting the server");
  });
