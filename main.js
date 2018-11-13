/**
 * @author Jack Considine <jackconsidine3@gmail.com>
 * @package
 * 2018-11-13
 */

const POST = 'Post';
const COMMENT = 'Comment';

Parse.Cloud.define('posts:get', async ({ params: { id } }) => {
  // Needs a post ID
  return new Parse.Query(POST).get(id, {
    useMasterKey: true
  });
});

Parse.Cloud.define('posts:list', async ({ params }) => {
  // Allow pagination
  const skip = params.skip || 0;
  const limit = params.limit || 20;

  return new Parse.Query(POST)
    .skip(skip)
    .limit(limit)
    .find({ useMasterKey: true });
});

Parse.Cloud.define('posts:create', async ({ user, params: { text } }) => {
  return new Parse.Object(POST, {
    text,
    user
  }).save(null, { useMasterKey: true });
});

Parse.Cloud.define('posts:delete', async ({ user, params: { id } }) => {
  if (!user) throw new Error('Unauthenticated'); // Not necessary, but prevents unused vars
  const post = await new Parse.Query(POST).get(id, {
    useMasterKey: true
  });
  return post.destroy({ useMasterKey: true });
});

Parse.Cloud.define('comment:get', async ({ params: id }) => {
  // Needs a post ID
  return new Parse.Query(COMMENT).get(id, {
    useMasterKey: true
  });
});

Parse.Cloud.define('comment:list', async ({ params }) => {
  // Allow pagination
  const skip = params.skip || 0;
  const limit = params.limit || 20;

  return new Parse.Query(COMMENT).skip(skip).limit(limit);
});

Parse.Cloud.define(
  'comment:create',
  async ({ user, params: { post_id, text } }) => {
    // Post should have text and should have a user and a post id
    if (!user) throw new Error('Unauthenticated'); // Not necessary, but prevents unused vars

    const post = await new Parse.Query(POST).get(post_id, {
      useMasterKey: true
    });
    return new Parse.Object(COMMENT, {
      text,
      user,
      post
    }).save(null, { useMasterKey: true });
  }
);

Parse.Cloud.define('comment:delete', async ({ user, params: { id } }) => {
  if (!user) throw new Error('Unauthenticated'); // Not necessary, but prevents unused vars

  const comment = await new Parse.Query(COMMENT).get(id, {
    useMasterKey: true
  });

  return comment.destroy({ useMasterKey: true });
});
