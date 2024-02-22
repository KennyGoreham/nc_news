const { selectArticleByArticleId, selectArticles, updateArticlesByArticleId, selectCommentsByArticleId, insertCommentByArticleId, insertArticle } = require('../models/articles-model.js');
const { selectTopicsByTopic } = require('../models/topics-model.js');

exports.getArticleByArticleId = (req, res, next) => {

    const { article_id } = req.params;

    selectArticleByArticleId(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    })
}

exports.getArticles = (req, res, next) => {

    const { topic, sort_by, order } = req.query;
    const promises = [selectArticles(topic, sort_by, order)];

    if(topic) {
        promises.push(selectTopicsByTopic(topic));
    }

    return Promise.all(promises)
    .then((promiseResolutions) => {
        res.status(200).send({ articles: promiseResolutions[0] });
    })
    .catch((err) => {
        next(err);
    })
}

exports.getCommentsByArticleId = (req, res, next) => {

    const { article_id } = req.params;

    const promises = [selectCommentsByArticleId(article_id), selectArticleByArticleId(article_id)];
    
    return Promise.all(promises)
    .then((promiseResolutions) => {
        if(promiseResolutions[0].length === 0) {
            res.status(200).send({ comments: [] });
        } else {
            res.status(200).send({ comments: promiseResolutions[0] });
        }
    })
    .catch((err) => {
        next(err);
    })
}

exports.postCommentByArticleId = (req, res, next) => {

    const { body, params: { article_id } } = req;

    insertCommentByArticleId(body, article_id)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchArticlesByArticleId = (req, res, next) => {

    const { params: { article_id }, body: { inc_votes } } = req;
    const promises = [updateArticlesByArticleId(inc_votes, article_id), selectArticleByArticleId(article_id)];

    return Promise.all(promises)
    .then((promiseResolutions) => {
        res.status(200).send({ article: promiseResolutions[0] });
    })
    .catch((err) => {
        next(err);
    })
}

exports.postArticle = (req, res, next) => {

    const { body: { article_img_url }, body } = req;

    insertArticle(body, article_img_url)
    .then((newArticle) => {
        return selectArticleByArticleId(newArticle.article_id)
    })
    .then((article) => {
        res.status(201).send({ article });
    })
    .catch((err) => {
        next(err);
    })
}