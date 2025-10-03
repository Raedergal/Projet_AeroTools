const { PrismaClient } = require("../generated/prisma/client")
const validateForm = require("../middleware/extensions/validateForm")
const prisma = new PrismaClient().$extends(validateForm)

exports.displayTools = async (req, res) => {
    const tools = await prisma.tool.findMany({
        include: {
            user: true
        }
    })
    res.render("pages/dashboard/partials/tools.twig", {
        currentPath: res.locals.currentPath,
        login: req.session.login,
        tools: tools
    })
}

exports.createTool = async (req, res) => {
    try {
        req.body.date = req.body.date === "" ? null : new Date(req.body.date)
        const tool = await prisma.tool.create({
            data: {
                name: req.body.name,
                sn: req.body.sn,
                controlDate: req.body.date
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
        req.body.date = req.body.date === "" ? null : new Date(req.body.date)
        const tool = await prisma.tool.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: req.body.name,
                sn: req.body.sn,
                controlDate: req.body.date
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
        res.render("pages/dashboard/partials/perception.twig", {
            currentPath: res.locals.currentPath,
            login: req.session.login,
            technicians: technicians,
            toolId: parseInt(req.params.id)
        })
    } catch (error) {
        res(error)

    }
}
exports.postPercepTool = async (req, res) => {
    try {
        const tool = await prisma.tool.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                userId: parseInt(req.body.userId)
            }
        })
        res.redirect("/tools")
    } catch (error) {
        res(error)
    }
}
exports.reintegerTool = async (req, res) => {
    try {
        const tool = await prisma.tool.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                userId: null
            }
        })
        res.redirect("/tools")
    } catch (error) {
        res(error)
    }
}