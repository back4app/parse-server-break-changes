/**
 * @author Jack Considine <jackconsidine3@gmail.com>
 * @package
 * 2018-11-13
 */

const POST = 'Post';
const COMMENT = 'Comment';

Parse.Cloud.define('posts:get', async request => {
  // Needs a post ID
  return new Parse.Query(POST).get(request.params.id, {
    useMasterKey: true
  });
});

Parse.Cloud.define('posts:list', async request => {
  // Allow pagination
  const skip = request.params.skip || 0;
  const limit = request.params.limit || 20;

  return new Parse.Query(POST)
    .skip(skip)
    .limit(limit)
    .find({ useMasterKey: true });
});

Parse.Cloud.define('posts:create', async request => {
  // Post should have text and should have a user
  if (!request.user) {
    throw new Error('unauthenticated!');
  }

  if (!request.params.text) {
    throw new Error('A post needs text!');
  }

  return new Parse.Object(POST, {
    text: request.params.text,
    user: request.user
  }).save(null, { useMasterKey: true });
});

Parse.Cloud.define('posts:delete', async request => {
  if (!request.user) {
    throw new Error('unauthenticated!');
  }

  if (!request.params.text) {
    throw new Error('A post needs text!');
  }

  if (!request.params.id) {
    throw new Error('Need Post ID!');
  }

  const post = await new Parse.Query(POST).get(request.params.id, {
    useMasterKey: true
  });
  return post.destroy({ useMasterKey: true });
});

Parse.Cloud.define('comment:get', async request => {
  // Needs a post ID
  return new Parse.Query(COMMENT).get(request.params.id, {
    useMasterKey: true
  });
});

Parse.Cloud.define('comment:list', async request => {
  // Allow pagination
  const skip = request.params.skip || 0;
  const limit = request.params.limit || 20;

  return new Parse.Query(COMMENT).skip(skip).limit(limit);
});

Parse.Cloud.define('comment:create', async request => {
  // Post should have text and should have a user and a post id
  if (!request.user) {
    throw new Error('unauthenticated!');
  }

  if (!request.params.text) {
    throw new Error('A comment needs text!');
  }
  if (!request.params.post_id) {
    throw new Error('A comment needs a post!');
  }

  //   Get the post

  const post = await new Parse.Query(POST).get(request.params.post_id, {
    useMasterKey: true
  });
  return new Parse.Object(COMMENT, {
    text: request.params.text,
    user: request.user,
    post: post
  }).save(null, { useMasterKey: true });
});

Parse.Cloud.define('comment:delete', async request => {
  if (!request.user) {
    throw new Error('unauthenticated!');
  }

  if (!request.params.id) {
    throw new Error('Need Comment ID!');
  }

  const comment = await new Parse.Query(COMMENT).get(request.params.id, {
    useMasterKey: true
  });

  return comment.destroy({ useMasterKey: true });
});
