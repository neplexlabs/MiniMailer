/** @type {import("electron-builder").Configuration} */
module.exports = {
    extends: null,
    productName: "MiniMailer",
    appId: "com.neplextech.minimailer",
    copyright: `Copyright © ${new Date().getFullYear()} Neplex Technologies`,
    files: ["./dist", "./app", "./public", "./package.json"],
    directories: {
        buildResources: "public",
        output: "builds/app"
    },
    extraMetadata: {
        main: "app/app.js"
    },
    icon: `${__dirname}/public/icon.png`,
    publish: ["github"],
    detectUpdateChannel: true,
    win: {
        target: "nsis"
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
    },
    linux: {
        target: "AppImage"
    },
    mac: {
        target: "dmg",
        category: "public.app-category.developer-tools"
    },
    generateUpdatesFilesForAllChannels: true
};
