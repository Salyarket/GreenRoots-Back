import { createLogger, format, transports } from "winston";
import { config } from "../../config.js";

export const logger = createLogger({
    // Je définis le niveau de log à afficher par défaut, par exemple : info et plus graves (warn, error)
    level: config.server.logLevel,
    format: format.combine(
    format.timestamp(),
    // J'ajoute un format de timestamp pour les logs
    format.json()
    ),
    defaultMeta:{
        service: "api-greenroots",
    },
    // Je définis les transports : où les logs vont être envoyés
    transports:[
        new transports.Console({
            format: format.combine(
                // J'affiche les logs dans la console avec un format lisible
                format.prettyPrint()
            )
        }),
        new transports.File({
            level: "error", // Possibilité de spécifier un niveau différent pour les fichiers
            filename: "error.log", // Nom du fichier de log
        }),
        new transports.File({
            level: 'http',
            filename: 'combined.log',
          }),
          new transports.Http({
            level: 'http',
            host: 'localhost',
            port: 3030, // Winston envoie les logs pour écoute à un autre service d’agrégation de logs
            path: '/api/logs'
          }),
    ]
});