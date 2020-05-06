import React from 'react';
import { Router, Redirect } from '@reach/router';
import styled from 'styled-components/macro';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import useSWR from 'swr';

import withLoginChecker from 'components/LoginChecker';

import DashboardTemplate from 'components/templates/DashboardTemplate';

import { ReactComponent as BadMoodIcon } from 'images/ic-mood-bad.svg';

const ProjectForm = React.lazy(() => import('components/organisms/ProjectForm'));
const PostForm = React.lazy(() => import('components/organisms/PostForm'));
const DashboardPostList = React.lazy(() => import('components/organisms/DashboardPostList'));
const SponsorList = React.lazy(() => import('components/organisms/SponsorList'));
const SeriesListForm = React.lazy(() => import('components/organisms/SeriesListForm'));
const DashboardMembershipList = React.lazy(() => import('components/organisms/DashboardMembershipList'));
const MembershipForm = React.lazy(() => import('components/organisms/MembershipForm'));
const CreatorProfileForm = React.lazy(() => import('components/organisms/CreatorProfileForm'));

const Styled = {
  Router: styled(Router)`
    display: flex;
    height: 100%;
  `,
  Container: styled.section`
    margin: auto;
    color: var(--gray);
    font-size: var(--font-size--base);
    text-align: center;
  `,
  BadMoodIcon: styled(BadMoodIcon)`
    width: 160px;
    height: 160px;
  `,
};

const NoMoreProject = () => (
  <Styled.Container>
    <Styled.BadMoodIcon />
    <p>
      최대 프로젝트 보유 가능 수를 초과하여
      <br />
      새 프로젝트를 만들 수 없습니다.
    </p>
  </Styled.Container>
);

const NotFound = () => (
  <Styled.Container>
    <Styled.BadMoodIcon />
    <p>
      페이지를 찾을 수 없습니다.
    </p>
  </Styled.Container>
);

function Dashboard() {
  const { data: projects } = useSWR('my/projects', {
    revalidateOnFocus: false,
    suspense: true,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <DashboardTemplate projects={projects}>
        <Styled.Router primary={false}>
          <Redirect from="/" to={projects.length ? `${projects[0].uri}/posts` : 'new-project'} noThrow />
          {projects.length >= 5
            ? <NoMoreProject path="new-project" />
            : <ProjectForm title="새 프로젝트" path="new-project" />
          }
          <Redirect from="/:projectId" to="/dashboard/:projectId/posts" noThrow />
          <ProjectForm title="프로젝트 정보 수정" path=":projectId/info" />
          <DashboardPostList title="포스트 관리" path=":projectId/posts" />
          <SeriesListForm title="시리즈 관리" path=":projectId/series" />
          <DashboardMembershipList title="후원 플랜 관리" path=":projectId/memberships" />
          <MembershipForm title="새 후원 플랜" path=":projectId/memberships/new" />
          <MembershipForm title="후원 플랜 수정" path=":projectId/memberships/:membershipId/edit" />
          <SponsorList title="구독자 목록" path=":projectId/members" />
          <PostForm title="새 포스트" path=":projectId/posts/new" />
          <PostForm title="포스트 수정" path=":projectId/posts/:postId/edit" />
          <CreatorProfileForm title="크리에이터 정보 설정" path="creator-profile" />
          <NotFound default />
        </Styled.Router>
      </DashboardTemplate>
    </DndProvider>
  );
}

export default withLoginChecker(Dashboard);
