/**
 * @author Jack Considine <jackconsidine3@gmail.com>
 * @package
 * 2018-11-13
 */

const POST = 'Post';
const COMMENT = 'Comment';

Parse.Cloud.define('posts:get', function(request, response) {
  // Needs a post ID
  return new Parse.Query(POST)
    .get(request.params.id, { useMasterKey: true })
    .then(post => {
      response.success(post);
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('posts:list', function(request, response) {
  // Allow pagination
  const skip = request.params.skip || 0;
  const limit = request.params.limit || 20;

  return new Parse.Query(POST)
    .skip(skip)
    .limit(limit)
    .find({ useMasterKey: true })
    .then(posts => {
      response.success(posts);
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('posts:create', function(request, response) {
  // Post should have text and should have a user
  if (!request.user) {
    return response.error({ message: 'unauthenticated!' });
  }

  if (!request.params.text) {
    return response.error({ message: 'A post needs text!' });
  }

  return new Parse.Object(POST, {
    text: request.params.text,
    user: request.user
  })
    .save(null, { useMasterKey: true })
    .then(post => {
      response.success(post);
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('posts:delete', function(request, response) {
  if (!request.user) {
    return response.error({ message: 'unauthenticated!' });
  }
  if (!request.params.id) {
    return response.error({ message: 'Need Post ID!' });
  }
  return new Parse.Query(POST)
    .get(request.params.id, { useMasterKey: true })
    .then(post => {
      return post.destroy({ useMasterKey: true });
    })
    .then(() => {
      response.success({});
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('comment:get', function(request, response) {
  // Needs a post ID
  return new Parse.Query(COMMENT)
    .get(request.params.id, { useMasterKey: true })
    .then(comment => {
      response.success(comment);
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('comment:list', function(request, response) {
  // Allow pagination
  const skip = request.params.skip || 0;
  const limit = request.params.limit || 20;

  return new Parse.Query(COMMENT)
    .skip(skip)
    .limit(limit)
    .find({ useMasterKey: true })
    .then(comments => {
      response.success(comments);
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('comment:create', function(request, response) {
  // Post should have text and should have a user and a post id
  if (!request.user) {
    return response.error({ message: 'unauthenticated!' });
  }

  if (!request.params.text) {
    return response.error({ message: 'A comment needs text!' });
  }
  if (!request.params.post_id) {
    return response.error({ message: 'A comment needs a post!' });
  }
  //   Get the post
  return new Parse.Query(POST)
    .get(request.params.post_id, {
      useMasterKey: true
    })
    .then(post => {
      return new Parse.Object(COMMENT, {
        text: request.params.text,
        user: request.user,
        post: post
      }).save(null, { useMasterKey: true });
    })
    .then(comment => {
      response.success(comment);
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});

Parse.Cloud.define('comment:delete', function(request, response) {
  if (!request.user) {
    return response.error({ message: 'unauthenticated!' });
  }

  if (!request.params.id) {
    return response.error({ message: 'Need Comment ID!' });
  }

  return new Parse.Query(COMMENT)
    .get(request.params.id, {
      useMasterKey: true
    })
    .then(comment => {
      return comment.destroy({ useMasterKey: true });
    })
    .then(() => {
      response.success({});
    })
    .catch(e => {
      response.error({ message: e.message });
    });
});
