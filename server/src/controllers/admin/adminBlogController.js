import BlogPost from '../../models/BlogPost.js';

export const getBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) { next(error); }
};

export const getBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) { next(error); }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: post, message: 'Created' });
  } catch (error) { next(error); }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: post, message: 'Updated' });
  } catch (error) { next(error); }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) { next(error); }
};
