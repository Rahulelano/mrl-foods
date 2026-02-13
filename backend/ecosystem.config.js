
module.exports = {
    apps: [
        {
            name: "mrl-foods-backend",
            script: "server.js",
            env: {
                NODE_ENV: "production",
                PORT: 7000,
            },
        },
    ],
};
