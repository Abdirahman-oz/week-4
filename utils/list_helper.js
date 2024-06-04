const _ = require("lodash")


const dummy = (blogs) => {
return 1;
  }
  
  const totalLikes = (blogs)=> {
    return blogs.reduce((total,blog)=> total + blog.likes,0);
}

const mostLiked = (blogs) => {
const blogsLikes = blogs.map(blogs => blogs.likes)
const largestIndex = blogsLikes.indexOf(Math.max(...blogsLikes))
const largestinfo = blogs[largestIndex]

return largestinfo.likes
};

const mostLikedLoadash = (blogs) => {
  const mostLikedBlog = _.maxBy(blogs, 'likes');
  
  return {author: mostLikedBlog.author, likes: mostLikedBlog.likes}
  // return mostLikedBlog ? mostLikedBlog.likes : null;
  // return  _.max(blogs.map(blog => blog.likes));
  };

  const mostRepeated = (blogs) => {
  //   const uniqueBlogs = _.uniqWith(blogs, (a, b) => {
  //     return (
  //         a.title === b.title &&
  //         a.author === b.author &&
  //         a.url === b.url &&
  //         a.likes === b.likes
  //     );
  // });
    const counts = _(blogs )
        .countBy('author')
        .entries()
        .maxBy(_.last);

    return { author: counts[0], blogs: counts[1] };
}

const leastLikedLoadash = (blogs) => {
  // const mostLikedBlog = _.minBy(blogs, 'likes');  
  // return {author: mostLikedBlog.author, likes: mostLikedBlog.likes}
const blogLikes = blogs.map(blog => blog.likes);
const blogIndex = blogLikes.indexOf(Math.min(...blogLikes))
const blogInfo  = blogs[blogIndex]

return {author: blogInfo.author,likes: blogInfo.likes}
};

  
  module.exports = {
    dummy,
    totalLikes,
    mostLiked,
    mostLikedLoadash,
    mostRepeated,
    leastLikedLoadash
  }