import BlogPost from '../../models/BlogPost.js';

export const getBlogPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const total = await BlogPost.countDocuments();
    const posts = await BlogPost.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) { next(error); }
};

export const getBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) { next(error); }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, status } = req.body;
    let author = req.body.author;
    if (!author || author === 'Admin') {
      author = req.user?._id;
    }
    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
      author,
      status: status || 'draft'
    });
    res.status(201).json({ success: true, data: post, message: 'Created' });
  } catch (error) { next(error); }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, status } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);
    if (status !== undefined) updateData.status = status;
    if (req.body.author && req.body.author !== 'Admin') updateData.author = req.body.author;

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('author', 'name email');
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
