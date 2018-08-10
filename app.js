const express=require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const app=express();
// session support is required to use ExpressOIDC
app.use(session({
    secret: 'this should be secure',
    resave: true,
    saveUninitialized: false
}));

const oidc = new ExpressOIDC({
    issuer: 'https://dev-339629.oktapreview.com/oauth2/default',
    client_id: '0oafwi60lsag8N2SP0h7',
    client_secret: 'jYB_NMhtglrwx6UTOutMuAM25-L7LCpjHG5F3WLA',
    redirect_uri: 'http://localhost:8080/authorization-code/callback',
    scope: 'openid profile'
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);

app.get('/', (req, res) => {
    if (req.userinfo) {
        res.send(`Hi ${req.userinfo.name}!`);
    } else {
        res.send('Hi!');
    }
});

app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
    res.send(JSON.stringify(req.userinfo));
});

oidc.on('ready', () => {
    app.listen(8080, () => console.log(`Started!`));
});

oidc.on('error', err => {
    console.log('Unable to configure ExpressOIDC', err);
});



