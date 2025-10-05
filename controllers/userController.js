const { PrismaClient } = require("../generated/prisma/client")
const hashPasswordExtension = require('../middleware/extensions/hashPassword')
const validateForm = require("../middleware/extensions/validateForm")

const bcrypt = require('bcrypt')
const prismaNoHash = new PrismaClient().$extends(validateForm)
const prisma = new PrismaClient().$extends(validateForm).$extends(hashPasswordExtension)

exports.displayRegister = async (req, res) => {
    try {
        const admin = await prisma.user.findFirst({
            where: {
                role: "ADMIN"
            }
        })
        if (admin) {
            return res.redirect("/login")
        }
        res.render("pages/register.twig")
    } catch (error) {
        res.send(error)
    }
}

exports.postAdmin = async (req, res) => {
    try {
        if (req.body.password == req.body.confirmPassword) {
            const admin = await prisma.user.create({
                data: {
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    email: req.body.email,
                    password: req.body.password,
                    role: "ADMIN"
                }
            })
            res.redirect('/login')
        } else {
            const error = new Error("Mot de passe non correspondant")
            error.confirmPassword = error.message
            throw error
        }
    } catch (error) {
        if (error.code == 'P2002') {
            res.render('pages/register.twig', {
                duplicateEmail: "Email déjà utilisé"
            })
        } else {
            res.render('pages/register.twig', {
                errors: error.details,
                confirmError: error.confirmPassword ? error.confirmPassword : null
            })
        }
    }
}

exports.displayLogin = async (req, res) => {
    try {
        const admin = await prisma.user.findFirst({
            where: {
                role: "ADMIN"
            }
        })
        if (admin) {
            res.render("pages/register.twig", {
                admin: admin,
                login: false,
                currentPath: res.locals.currentPath,
            })
        } else { res.redirect("/register") }

    } catch (error) {
        res.render("pages/login.twig", {
            error: "Erreur interne, merci de réessayer.",
            login: false
        })
    }
}

exports.login = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email }
        })

        if (!user) {
            const error = new Error("Mot de passe ou email non correspondant")
            error.login = error.message
            throw error
        }

        const validPassword = bcrypt.compareSync(req.body.password, user.password)
        if (!validPassword) {
            const error = new Error("Mot de passe non correspondant")
            error.password = error.message
            throw error
        }

        req.session.user = user

        const emailPassword = bcrypt.compareSync(user.email, user.password)
        if (emailPassword) {
            return res.render("pages/changePassword.twig", {
                login: false
            })
        }

        req.session.login = true
        res.redirect('/dashboard')

    } catch (error) {
        res.render("pages/login.twig", {
            currentPath: res.locals.currentPath,
            errorLogin: error.login ? error.login : null,
            errorPassword: error.password ? error.password : null,
            login: false
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        if (req.body.password == req.body.confirmPassword) {
            const user = await prisma.user.update({
                where: {
                    id: parseInt(req.session.user.id),
                },
                data: {
                    password: req.body.password,
                }
            })
        } else {
            const error = new Error("Mot de passe non correspondant")
            error.confirmPassword = error.message
            throw error
        }
        res.redirect('/login')
    } catch (error) {
        res.render('pages/changePassword.twig', {
            confirmError: error.confirmPassword ? error.confirmPassword : null
        })
    }
}

exports.displayDashboard = async (req, res) => {
    try {
        const toolsWithUser = await prisma.tool.count({
            where: {
                userId: { not: null }
            }
        })
        const userWithTool = await prisma.user.count({
            where: {
                tools: {
                    some: {}
                }
            }
        })
        const tools = await prisma.tool.findMany({
            where: {
                userId: { not: null }
            },
            include: {
                user: {
                    include: {
                        aeronef: true
                    }
                }
            }
        })
        req.session.tools = tools
        req.session.toolsWithUser = toolsWithUser
        req.session.userWithTool = userWithTool

        res.render("pages/dashboard/dashboard.twig", {
            currentPath: res.locals.currentPath,
            user: req.session.user,
            login: req.session.login,
            toolsWithUser: req.session.toolsWithUser,
            userWithTool: req.session.userWithTool,
            tools: req.session.tools,
            dashboard: true
        })
    } catch (error) {
        res.send(error)
    }
}



exports.displayTechnicians = async (req, res) => {
    const technicians = await prisma.user.findMany({
        where: {
            role: "USER"
        },
        include: {
            tools: true,
            aeronef: true
        }
    })
    const aeronefs = await prisma.aeronef.findMany()

    res.render("pages/dashboard/partials/technicians.twig", {
        user: req.session.user,
        currentPath: res.locals.currentPath,
        technicians: technicians,
        aeronefs: aeronefs,
        login: req.session.login
    })
}

exports.createTechnicians = async (req, res) => {

    try {
        const user = await prisma.user.create({
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                password: req.body.email,
                aeronefId: parseInt(req.body.aeronef),
                photo: "/assets/uploads/" + req.file.filename
            }
        })
        res.redirect('/technicians')
    } catch (error) {
        if (error.code == 'P2002') {
            res.render('pages/dashboard/dashboard.twig', {
                currentPath: res.locals.currentPath,
                dashboard: true,
                login: req.session.login,
                duplicateEmail: true
            })
        } else {
            res.render('pages/dashboard/dashboard.twig', {
                currentPath: res.locals.currentPath,
                login: req.session.login,
                errors: error.details,
            })
        }
    }
}

exports.removeTechnician = async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect('/technicians')
    } catch (error) {
        res.json(error)
    }
}

exports.editUser = async (req, res) => {
    try {
        const fileName = req.file ? "/assets/uploads/" + req.file.filename : undefined
        const user = await prismaNoHash.user.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                aeronefId: req.body.aeronef ? parseInt(req.body.aeronef) : null,
                photo: fileName
            }
        })
        res.redirect('/technicians')
    } catch (error) {
        if (error.code == 'P2002') {
            res.send(error)
            res.redirect('/technicians')
        }
        else {
            console.log(error);
            res.redirect('/technicians')
        }
    }
}

exports.schedule = async (req, res) => {
    try {
        const tools = await prisma.tool.findMany({
            where: {
                controlDate: { not: null },
            },
        })
        res.render("pages/dashboard/partials/schedule.twig", {
            user: req.session.user,
            currentPath: res.locals.currentPath,
            login: req.session.login,
            tools: JSON.stringify(tools)
        })
    } catch (error) {
        res.send(error)
    }

}

exports.logout = async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}

exports.cancelled = async (req, res) => {
    res.redirect('/dashboard')
}