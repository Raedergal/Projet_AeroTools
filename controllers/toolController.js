const { PrismaClient } = require("../generated/prisma/client")
const validateForm = require("../middleware/extensions/validateForm")
const prisma = new PrismaClient().$extends(validateForm)

exports.displayTools = async (req, res) => {
    const tools = await prisma.tool.findMany({
        include: {
            user: true
        }
    })
    console.log(tools);

    res.render("pages/dashboard/partials/tools.twig", {
        currentPath: res.locals.currentPath,
        login: req.session.login,
        tools: tools
    })
}

exports.createTool = async (req, res) => {
    try {
        console.log(req.body);

        const tool = await prisma.tool.create({
            data: {
                name: req.body.name,
                controlDate: new Date(req.body.date),
            }
        })
        res.redirect('/tools')
    } catch (error) {
        res.render("pages/dashboard/partials/tools.twig", {
            currentPath: res.locals.currentPath,
            login: req.session.login,
            errors: error.details,
        })
    }
}

exports.editTool = async (req, res) => {
    try {
        const tool = await prisma.tool.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                name: req.body.name,
                controlDate: new Date(req.body.date),
            }
        })
        res.redirect('/tools')
    } catch (error) {
        if (error.code == 'P2002') {
            res.send(error)
        }
        else {
            res.send(error)
        }
    }
}

exports.deleteTool = async (req, res) => {
    try {
        const tool = await prisma.tool.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect('/tools')
    } catch (error) {
        res.json(error)
    }
}

exports.percepTool = async (req, res) => {
    try {
        const technicians = await prisma.user.findMany({
            where: {
                role: "USER"
            },
            include: {
                aeronef: true
            }
        })
        res.render("pages/dashboard/partials/technicians.twig", {
            currentPath: res.locals.currentPath,
            login: req.session.login,
            technicians: technicians
        })

    } catch (error) {
        res(error)

    }
}