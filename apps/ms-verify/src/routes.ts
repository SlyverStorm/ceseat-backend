import { Express } from "express";

function routes(app: Express) {

    app.get("/auth/verify",  (req, res) => {
        res.sendStatus(403)
    })
}

export default routes;