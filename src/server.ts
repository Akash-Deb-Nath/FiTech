// import app from "./app";
// import { envVars } from "./config/envVars";

const bootstrap = () => {
  try {
    // app.listen(envVars.PORT, () => {
    //   console.log(`Server is running on http://localhost:${envVars.PORT}`);
    // });
  } catch (error) {
    console.error("Failed to start server: ", error);
  }
};

bootstrap();
