const { PrismaClient } = require("../generated/prisma/client")
const hashPasswordExtension = require('../middleware/extensions/hashPassword')
const validateForm = require("../middleware/extensions/validateForm")
const bcrypt = require('bcrypt')
const prisma = new PrismaClient().$extends(validateForm).$extends(hashPasswordExtension)

exports.displayRegister = async (req, res) => {
    res.render("pages/register.twig")
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
    const admin = await prisma.user.findMany({
        where: {
            role: "ADMIN"
        }
    })

    if (admin) {
        res.render("pages/login.twig", {
            admin: admin,
            login: false
        })
    } else {
        res.redirect('/register')
    }
}

exports.login = async (req, res) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                email: req.body.email,
                role: "ADMIN"
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
                role: "USER"
            }
        })
        if (bcrypt.compareSync(req.body.password, admin.password) || bcrypt.compareSync(req.body.password, user.password)) {
            if (admin) {
                req.session.admin = admin
                req.session.login = true
            } else {
                req.session.user = user
            }
            res.redirect('/dashboard')
        }
    } catch (error) {
        res.render("pages/login.twig", {
            error: error
        })
    }
}

exports.displayDashboard = async (req, res) => {
    const tools = await prisma.tool.findMany({
        where: {
            NOT: {
                userId: null
            }
        },
        include: {
            user: true
        }
    })

    res.render("pages/dashboard/dashboard.twig", {
        admin: req.session.admin,
        login: req.session.login,
        tools: tools,
        dashboard: true
    })
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
                aeronefId: parseInt(req.body.aeronef)
            }
        })
        res.redirect('/technicians')
    } catch (error) {
        if (error.code == 'P2002') {
            res.render('pages/dashboard/dashboard.twig', {
                currentPath: res.locals.currentPath,
                dashboard: true,
                login: req.session.login,
                duplicateEmail: "Email déjà utilisé"
            })
            res.redirect('/technicians')
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
    const aeronefId = req.body.aeronef === "" ? null : parseInt(req.body.aeronef)

    try {
        const user = await prisma.user.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                aeronefId: aeronefId
            }
        })
        res.redirect('/technicians')
    } catch (error) {
        if (error.code == 'P2002') {
            res.send(error)
        }
        else {
            res.send(error)
        }
    }
}


exports.cancelled = async (req, res) => {
    res.redirect('/dashboard')
}