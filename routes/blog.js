const User = require('../models/users');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/databse');

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {
        console.log("req.body", req.body)
        if (!req.body.title) {
            res.send({
                success: false,
                msg: "Title is requred"
            })
        }
        else {
            if (!req.body.body) {
                res.send({
                    success: false,
                    msg: "Description is requred"
                })
            }
            else {
                if (!req.body.createdBy) {
                    res.send({
                        success: false,
                        msg: "Need to write who created the post"
                    })
                } else {

                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy,
                        createdAt: req.body.createdAt
                    })
                    blog.save((err, result) => {
                        // if (err) {

                        //     if (err.errors) {
                        //                     if (err.errors.title) {
                        //                         res.send({ success: false, msg: err.errors.title.msg })
                        //                     }
                        //                     else {
                        //                             if (err.errors.body) {
                        //                                 res.send({ success: false, msg: err.errors.body.msg })
                        //                             }
                        //                             else {
                        //                                 res.send({ success: false, msg: err.errmsg })
                        //                             }
                        //                     }
                        //                 }
                        //         else {
                        //             res.send({
                        //                 success: false,
                        //                 msg: err
                        //             })
                        //         }
                        //     }
                        
                        // else {
                        //     res.send({
                        //         success: true,
                        //         msg: "Post created",
                        //         postInfo: result
                        //     })
                        // }
                        res.send({
                            success: true,
                                msg: "Post created",
                                postInfo: result
                        })
                    });

                }
            }
        }
    })

    return router;
};