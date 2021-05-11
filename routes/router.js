const express = require('express');
const router = express.Router();
const Article = require('./../modals/article');

router.get('/new', (req, res) => {
    res.render('articles/new', { articleData: new Article() });
})
router.get('/edit/:id', async(req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { articleData: article });
})
router.get('/:id', async(req, res) => {
    const article = await Article.findById(req.params.id);
    if (Article == null) {
        res.redirect('/');
    } else {
        res.render('articles/show', { articleData: article });
    }
})

//route for saving the articles
router.post('/', async(req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleRedirect('new'));

router.put('/:id', async(req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleRedirect('edit'));

router.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveArticleRedirect(path) {

    return async(req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.id}`);
        } catch (e) {
            res.render(`articles/${path}`, { articleData: article });
        }
    }
}



module.exports = router;