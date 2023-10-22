import app from "../infra/server/app";

if (process.env.CODETOREMOVEALLGAMES === undefined) {
    console.log("🚨 Needed variable is not set: CODETOREMOVEALLGAMES");
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`🖥️  Server is listening on port ${process.env.PORT || 3000}`);
});
