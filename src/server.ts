require("dotenv").config();
const app = require("./app");

const DOCKER_PORT = process.env.NODE_DOCKER_PORT || 8080;
const LOCAL_PORT = process.env.NODE_LOCAL_PORT || 6868;

app.listen(DOCKER_PORT, () => {
    console.log(`server running on http://localhost:${ LOCAL_PORT }`);
});

export{}