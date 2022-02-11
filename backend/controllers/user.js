const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../database_connect");
require('dotenv').config();

//MIDDLEWARE Inscription
exports.signup = (req, res, next) => {
    //Cryptage Email
    const buffer = Buffer.from(req.body.email);
    const cryptedEmail = buffer.toString('base64');
    //Verification email disponible
    db.query(`SELECT * FROM users WHERE email='${cryptedEmail}'`,
            (err, results, rows) => {
                //Si email deja utilisé
                if (results.length > 0) {
                    res.status(401).json({
                        message: 'Email non disponible.'
                    });
                    //Si email disponible
                } else {
                //Cryptage du MDP
                bcrypt.hash(req.body.password, 10)
                .then(cryptedPassword => {
                    //Ajout à la BDD
                    db.query(`INSERT INTO users VALUES (NULL, '${req.body.nom}', '${req.body.prenom}', '${cryptedPassword}', '${cryptedEmail}', 0)`,
                        (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json("erreur");
                            }
                            return res.status(201).json({
                                message: 'Votre compte a bien été crée !'
                            });
                        }
                    );
                })
                .catch(error => res.status(500).json({
                    error
                }));
            }
            });
};
// FIN MIDDLEWARE

//MIDDLEWARE Connexion
exports.login = (req, res, next) => {
    const buffer = Buffer.from(req.body.email);
    const cryptedEmail = buffer.toString('base64');
    //Recherche de l'utilisateur dans la BDD
    db.query(`SELECT * FROM users WHERE email='${cryptedEmail}'`,
        (err, results, rows) => {
            //Si utilisateur trouvé : 
            if (results.length > 0) {
                //Verification du MDP
                bcrypt.compare(req.body.password, results[0].password)
                    .then(valid => {
                        //Si MDP invalide erreur
                        if (!valid) {
                            res.status(401).json({
                                message: 'Mot de passe incorrect.'
                            });
                            //Si MDP valide création d'un token
                        } else {
                            res.status(200).json({
                                userId: results[0].id,
                                nom: results[0].nom,
                                prenom: results[0].prenom,
                                admin: results[0].admin,
                                token: jwt.sign({
                                    userId: results[0].id
                                }, process.env.TOKEN, {
                                    expiresIn: '24h'
                                })
                            });
                        }
                    });
            } else {
                res.status(404).json({
                    message: 'Utilisateur inconnu.'
                });
            }
        }
    );
};
// FIN MIDDLEWARE


// MIDDLEWARE Delete User
exports.deleteUser = (req, res, next) => {
    const buffer = Buffer.from(req.body.email);
    const cryptedEmail = buffer.toString('base64');
    //Recherche de l'utilisateur dans la BDD
    db.query(`DELETE * FROM users WHERE users.id = ${req.params.id}`, 
    (error, result, field) => {
        if (error) {
            return res.status(400).json({
                error
            });
        }
    }
    );
};
// FIN MIDDLEWARE

//MIDDLEWARE Account
exports.profile = (req, res, next) => {
    const buffer = Buffer.from(req.body.email);
    const cryptedEmail = buffer.toString('base64');
    const userID = res.locals.userID;
    let userIDAsked = req.params.id;
    let dbGetUser;
    if (userIDAsked === "yourProfile") {
        userIDAsked = userID;
    }
    //Recherche de l'utilisateur dans la BDD
    dbGetUser = `SELECT email, firstName, lastName, pseudo, bio, avatarUrl, DATE_FORMAT(dateCreation, 'Inscrit depuis le %e %M %Y à %kh%i') AS dateCreation,
    COUNT(CASE WHEN userID = ? then 1 else null end) AS yourProfile FROM User WHERE userID = ?`;
    db.query(dbGetUser, [userID, userIDAsked], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        };
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun utilisateur ne correspond à votre requête" });
        }
        res.status(200).json(result);
    });
}
// FIN MIDDLEWARE

// MIDDLEWARE Modify User
exports.modify = (req, res, next) => {
    const userID = res.locals.userID;
    const email = req.body.email;
    const pseudo = req.body.pseudo;
    const bio = req.body.bio;
    const password = req.body.password;

    let sqlFindUser;
    let sqlModifyUser;
    let sqlChangePassword;
    let values;

    if (req.file) { // Si le changement concerne l'avatar on update directement
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        sqlFindUser = "SELECT avatarUrl FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }

            const filename = result[0].avatarUrl.split("/images/")[1];
            sqlModifyUser = "UPDATE User SET avatarUrl = ? WHERE userID = ?";
            if (filename !== "avatarDefault.jpg") {
                fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                    mysql.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        return res.status(200).json({ message: "Utilisateur modifé !" });
                    });
                })
            } else {
                mysql.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    return res.status(200).json({ message: "Utilisateur modifé !" });
                });
            }
        });

    } else { // Si le changement concerne les infos de l'user on demande le mdp
        sqlFindUser = "SELECT password FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }

            const newPassword = req.body.newPassword;
            const passwordHashed = result[0].password;
            bcrypt.compare(password, passwordHashed)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }

                    if (newPassword) { // Si un nouveau mdp est défini
                        bcrypt.hash(newPassword, 10)
                            .then(hash => {
                                sqlChangePassword = "UPDATE User SET email=?, pseudo=?, bio=?, password=? WHERE userID = ?";
                                values = [email, pseudo, bio, hash, userID];
                                mysql.query(sqlChangePassword, values, function (err, result) {
                                    if (err) {
                                        return res.status(500).json(err.message);
                                    }
                                    if (result.affectedRows == 0) {
                                        return res.status(400).json({ message: "Changement échoué !" });
                                    }
                                    res.status(200).json({ message: "Changement réussi !" });
                                });
                            })
                            .catch(e => res.status(500).json(e));

                    } else { // Si le mdp reste le même
                        sqlModifyUser = "UPDATE User SET email=?, pseudo=?, bio=? WHERE userID = ?";
                        values = [email, pseudo, bio, userID];
                        mysql.query(sqlModifyUser, values, function (err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                            if (result.affectedRows == 0) {
                                return res.status(400).json({ message: "Changement échoué !" });
                            }
                            res.status(200).json({ message: "Changement réussi !" });
                        });
                    }
                })
                .catch(e => res.status(500).json(e));
        });
    }
}
// FIN MIDDLEWARE