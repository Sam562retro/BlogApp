//****Start of imports****
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const override = require('method-override');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main', partialsDir: 'views\\articles\\partials' });
const router = require('./routes/router');
const Article = require('./modals/article');
//****End of imports****

const connection = () => {
    mongoose.connect('mongodb://localhost/blogApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected With Mongo DB');
};

connection();

const port = 3000;
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({
    extended: false
}));
app.use(override('_method'));

//*** routes ***
app.get('/', async(req, res) => {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/home', { articlesData: articles });
    })
    //*** end of routes ***
app.use('/articles', router);
//********* listening to port ********
app.listen(port);