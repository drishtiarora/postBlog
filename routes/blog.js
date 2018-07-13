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

    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, result) => {
            console.log(result);

            if (err) {
                res.send({
                    success: false,
                    msg: err
                })
            }
            else {
                if (!result) {
                    res.send({
                        success: false,
                        msg: "No blogs found"
                    })
                }
                else {
                    res.send({
                        success: true,
                        msg: result
                    })
                }
            }

        }).sort({ '_id': -1 });  // to put newest blogs on top
    })

    router.get('/singleBlog/:id', (req, res) => {

        console.log("req.params for edit", req.params);

        Blog.findOne({ _id: req.params.id }, (err, blog) => {
            console.log("result is", blog)
            if (err) {
                res.send({
                    success: false,
                    msg: "Not valid blog id"
                })
            }
            else {
                if (!blog) {
                    res.send({

                        super: false,
                        msg: "Blog Not Found"
                    })
                }
                else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.send({
                                success: false,
                                msg: err
                            })
                        }
                        else {
                            if (!user) {
                                res.send({
                                    success: false,
                                    msg: 'Unable to authenticate user'
                                })
                            }
                            else {
                                if (user.username !== blog.createdBy) {
                                    res.send({
                                        success: false,
                                        msg: 'You are not able to authorize to edit this blog'
                                    })
                                }
                                else {
                                    res.send({
                                        success: true,
                                        msg: blog
                                    })
                                }
                            }
                        }
                    })
                }
            }
        });
    })

    router.put('/updateBlog', (req, res) => {
        console.log("id blog" , req.body)
        if (!req.body._id) {
            res.send({
                success: false,
                msg: 'No blog id provided   '
            })
        }
        else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {
                    res.send({
                        success: false,
                        msg: 'not valid blog id'
                    })
                }
                else {
                    if (!blog) {
                        res.send({
                            success: false,
                            msg: 'blog id not found'
                        })
                    }
                    else {

                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.send({
                                    success: false,
                                    msg: err
                                })
                            }
                            else {
                                if (err) {
                                    res.send({
                                        success: false,
                                        msg: "Unable to authenticate user"
                                    })
                                }
                                else {
                                    if (user.username !== blog.createdBy) {
                                        res.send({
                                            success: false,
                                            msg: 'You are not authorized to edit this post'
                                        })
                                    }
                                    else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body
                                        blog.save((err) => {
                                            if (err) {
                                                res.send({
                                                    success: false,
                                                    msg: err
                                                })
                                            }
                                            else {
                                                res.send({
                                                    success: true,
                                                    msg: "Blog Updated"
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }

                }
            })
        }
    });


    return router;
};