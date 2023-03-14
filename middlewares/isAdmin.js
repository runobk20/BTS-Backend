const isAdmin = (req, res, next) => {

    if(req.role === 'project leader') {
        return next();
    }

    return res.status(403).json({
        ok: false,
        msg: 'This action is reserved for project leaders.'
    });
}

module.exports = { isAdmin };