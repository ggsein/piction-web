import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Link } from '@reach/router';
import useSWR, { useSWRPages } from 'swr';

import Grid from 'styles/Grid';
import media from 'styles/media';

import { ReactComponent as BadMoodIcon } from 'images/ic-mood-bad.svg';

import PostItem from 'components/molecules/PostItem';
import { PrimaryButton } from 'components/atoms/Button';

const Styled = {
  Container: styled.section`
    display: flex;
    flex-flow: column;
    grid-column: 1 / -1;
  `,
  Empty: styled.div`
    margin: 80px auto;
    color: var(--gray--dark);
    font-size: var(--font-size--base);
    text-align: center;
  `,
  BadMoodIcon: styled(BadMoodIcon)`
    width: 160px;
    height: 160px;
  `,
  Link: styled(Link)`
    display: flex;
    flex-flow: column;
    grid-column: 1 / -1;
    ${media.desktop`
      grid-column : span 3;
    `}
  `,
  PostItem: styled(PostItem)`
    flex: 1;
  `,
  More: styled(PrimaryButton)`
    margin-right: auto;
    margin-left: auto;
  `,
};

function PostList({
  projectId, subscription, isMyProject, ...props
}) {
  const FETCHING_SIZE = 40;

  function PostsPage({ offset, withSWR }) {
    const { data } = withSWR(
      useSWR(`/projects/${projectId}/posts?size=${FETCHING_SIZE}&page=${offset + 1}`),
    );

    if (!data) {
      return [...new Array(FETCHING_SIZE)].map(() => (
        <Styled.Link to="#">
          <PostItem.Placeholder />
        </Styled.Link>
      ));
    }

    if (data.content.length === 0) {
      return (
        <Styled.Empty>
          <Styled.BadMoodIcon />
          <p>
            등록된 포스트가 없습니다.
          </p>
        </Styled.Empty>
      );
    }

    return data.content.map(content => (
      <Styled.Link
        to={`${content.id}`}
        key={content.id}
      >
        <Styled.PostItem
          {...content}
          isLocked={!isMyProject && content.fanPass && (subscription ? content.fanPass.level > subscription.fanPass.level : true)}
        />
      </Styled.Link>
    ));
  }

  function nextOffset({ data }) {
    if (data.last) return null;
    return data.pageable.pageNumber + 1;
  }

  const {
    pages,
    isLoadingMore,
    isReachingEnd,
    loadMore,
  } = useSWRPages(`projects/${projectId}/posts`, PostsPage, nextOffset, [projectId, subscription, isMyProject]);

  return (
    <Styled.Container>
      <Grid {...props}>
        {pages}
      </Grid>
      {!(isLoadingMore || isReachingEnd) && (
      <Styled.More onClick={() => loadMore()}>
        포스트 더 보기
      </Styled.More>
      )}
    </Styled.Container>
  );
}

PostList.propTypes = {
  projectId: PropTypes.string.isRequired,
  subscription: PropTypes.object,
  isMyProject: PropTypes.bool,
};

export default PostList;
