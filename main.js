/**
 * @author Jack Considine <jackconsidine3@gmail.com>
 * @package
 * 2018-11-13
 */

const POST = 'Post';
const COMMENT = 'Comment';

const AssertParams = parameter_obj => {
  for (var key of Object.keys(parameter_obj)) {
    if (!parameter_obj[key]) throw new Error(`Missing parameter ${key}`);
  }
};

Parse.Cloud.define('posts:get', async ({ params: { id } }) => {
  AssertParams({ id });
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
  AssertParams({ user, text });
  return new Parse.Object(POST, {
    text,
    user
  }).save(null, { useMasterKey: true });
});

Parse.Cloud.define('posts:delete', async ({ user, params: { id } }) => {
  AssertParams({ user, id });
  const post = await new Parse.Query(POST).get(id, {
    useMasterKey: true
  });
  return post.destroy({ useMasterKey: true });
});

Parse.Cloud.define('comment:get', async ({ params: id }) => {
  // Don't need to assert parameter necessarily because 'get' will error without an id
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
    AssertParams({ post_id, text, user });
    // Post should have text and should have a user and a post id

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
  AssertParams({ id, user });
  const comment = await new Parse.Query(COMMENT).get(id, {
    useMasterKey: true
  });

  return comment.destroy({ useMasterKey: true });
});
