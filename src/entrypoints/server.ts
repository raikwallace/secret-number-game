import app from "../infra/server/app";

app.listen(process.env.PORT || 3000, () => {
    console.log(`🖥️  Server is listening on port ${process.env.PORT || 3000}`);
});
