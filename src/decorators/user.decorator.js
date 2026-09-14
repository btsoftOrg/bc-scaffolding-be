const userDecorator = user => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
});

module.exports = userDecorator;
