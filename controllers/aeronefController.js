const { PrismaClient } = require("../generated/prisma/client")
const validateForm = require("../middleware/extensions/validateForm")
const prisma = new PrismaClient().$extends(validateForm)

exports.createAeronefDisplay = async (req, res) => {
    res.render("pages/dashboard/dashboard.twig", {
        user: req.session.user,
        currentPath: res.locals.currentPath,
        tools: req.session.tools,
        toolsWithUser: req.session.toolsWithUser,
        userWithTool: req.session.userWithTool,
        dashboard: true,
        login: true
    })
}

exports.postAeronef = async (req, res) => {
    try {
        const aeronef = await prisma.aeronef.create({
            data: {
                immat: req.body.immat.toUpperCase()
            }
        })
        res.redirect('/dashboard')
    } catch (error) {
        if (error.code == 'P2002') {
            res.render("pages/dashboard/dashboard.twig", {
                dashboard: true,
                login: true,
                duplicateImmat: "Immat déjà existant"
            })
        } else {
            res.render("pages/dashboard/dashboard.twig", {
                dashboard: true,
                login: true,
                errors: error.details
            })
        }
    }
}