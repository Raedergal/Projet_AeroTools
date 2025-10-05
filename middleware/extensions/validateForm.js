const { Prisma } = require('@prisma/client')

module.exports = Prisma.defineExtension({
    name: 'formValidateExtension',
    query: {
        user: {
            create: async ({ operation, args, query }) => {
                const errors = {}

                if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(args.data.lastName)) {
                    errors.lastName = "Nom invalide (pas de chiffre ni caractere speciaux)";
                }

                if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(args.data.firstName)) {
                    errors.firstName = "Prénom invalide (pas de chiffre ni caractere speciaux)"
                }
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(args.data.email)) {
                    errors.email = "Email invalide"
                }

                // if (!/^[A-Za-z\d]{4,}$/.test(args.data.password)) {
                //     errors.password = "Mot de passe invalide (min 4 caracteres)"
                // }
                // if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(args.data.password)) {
                //     errors.password = "Mot de passe invalide (min 8 caractères, 1 majuscule, 1 chiffre et 1 charactère spécial)"
                // }

                if (Object.keys(errors).length > 0) {
                    const error = new Error("Erreur de validation")
                    error.details = errors
                    throw error;
                }

                return query(args)

            },
            update: async ({ operation, args, query }) => {
                const errors = {}
                if (args.data.lastName !== undefined) {
                    if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(args.data.lastName)) {
                        errors.lastName = "Nom invalide (pas de chiffre ni caractere speciaux)";
                    }
                }
                if (args.data.firstName !== undefined) {
                    if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(args.data.firstName)) {
                        errors.firstName = "Prénom invalide (pas de chiffre ni caractere speciaux)"
                    }
                }
                if (args.data.email !== undefined) {
                    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(args.data.email)) {
                        errors.email = "Email invalide"
                    }
                }

                // if (!/^[A-Za-z\d]{4,}$/.test(args.data.password)) {
                //     errors.password = "Mot de passe invalide (min 4 caracteres)"
                // }
                // if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(args.data.password)) {
                //     errors.password = "Mot de passe invalide (min 8 caractères, 1 majuscule, 1 chiffre et 1 charactère spécial)"
                // }

                if (Object.keys(errors).length > 0) {
                    const error = new Error("Erreur de validation")
                    error.details = errors
                    throw error;
                }

                return query(args)

            }
        },
        aeronef: {
            $allOperations: async ({ operation, args, query }) => {
                if (operation == "create" || operation == "update") {
                    const errors = {}

                    if (!/^[A-Za-z]{5}$/.test(args.data.immat)) {
                        errors.immat = "Immat invalide (5 caractères alphabétiques obligatoire)"
                    }

                    if (Object.keys(errors).length > 0) {
                        const error = new Error("Erreur de validation")
                        error.details = errors
                        throw error;
                    }
                }

                return query(args)
            },
        },
        tool: {
            $allOperations: async ({ operation, args, query }) => {
                if (operation == "create" || operation == "update") {
                    const errors = {}
                    if (!/[A-Za-z0-9 ]/.test(args.data.name)) {
                        errors.name = "Nom invalide"
                    }

                    if (!/[A-Za-z0-9 ]/.test(args.data.sn)) {
                        errors.sn = "SN invalide"
                    }

                    if (Object.keys(errors).length > 0) {
                        const error = new Error("Erreur de validation")
                        error.details = errors
                        console.log(error);
                        throw error;
                    }
                }
                return query(args)
            }
        }
    }
})
