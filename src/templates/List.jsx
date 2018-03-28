import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import fp from 'lodash/fp';
import PostsWrapper from '~/components/Common/PostsWrapper';
import Card from '~/components/Common/Card';
import Pagination from '~/components/Common/Pagination';
import getPosts from '~/utils/getPosts';
import getPage from '~/utils/getPage';
import { CONTENT_PER_PAGE } from '~/constants';

const List = ({
  data,
  location,
}) => {
  const page = getPage(2)(location);
  const siteTitle = fp.get('site.siteMetadata.title')(data);
  const allPosts = getPosts(data);
  const postCount = fp.size(allPosts);
  const posts = fp.slice(
    (page - 1) * CONTENT_PER_PAGE,
    page * CONTENT_PER_PAGE
  )(allPosts);

  return ([
    <PostsWrapper key="posts-wrapper">
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="og:title" content={siteTitle} />
      </Helmet>
      {fp.map((post) => {
        if (post.node.path !== '/404/') {
          const frontmatter = fp.get('node.frontmatter')(post);
          const { tags, path } = frontmatter;

          return (
            <Card key={path} path={path} tags={tags} {...frontmatter} hasTags={!fp.isEmpty(tags)} />
          );
        }

        return null;
      })(posts)}
    </PostsWrapper>,
    <Pagination key="pagination" postCount={postCount} location={location} />,
  ]);
};

List.propTypes = {
  data: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
};

export default List;

/* eslint-disable no-undef */
export const pageQuery = graphql`
  query ListQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark (
      filter: {
        frontmatter: {
          hide: { ne: true }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            type
            title
            path
            tags
            date(formatString: "DD MMMM, YYYY")
            summary
          }
        }
      }
    }
  }
`;
/* eslint-enable no-undef */
