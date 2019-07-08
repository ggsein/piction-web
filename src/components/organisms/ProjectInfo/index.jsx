import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '@reach/router';
import moment from 'moment';
import 'moment/locale/ko';

import { MainGrid } from 'styles/Grid';
import media, { mediaQuery } from 'styles/media';

import useMedia from 'hooks/useMedia';

import SynopsisPopup from 'components/molecules/SynopsisPopup';

import ContentImage from 'components/atoms/ContentImage';
import Heading from 'components/atoms/Heading';
import { PrimaryButton } from 'components/atoms/Button';

import { ReactComponent as AccessTimeIcon } from 'images/ic-access-time.svg';
import { ReactComponent as InfoIcon } from 'images/ic-info.svg';
import dummyWideThumbnailImage from 'images/img-dummy-1440x450.jpg';
import dummyUserPicture from 'images/img-user-profile.svg';

const Styled = {
  Section: styled.section`
    display: flex;
    flex-flow: column;
    position: relative;
  `,
  WideThumbnail: styled(ContentImage)`
    max-height: 450px;
  `,
  MainGrid: styled(MainGrid)`
    row-gap: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
    ${media.desktop`
      padding-top: 24px;
      padding-bottom: 24px;
    `}
  `,
  Text: styled.div`
    display: flex;
    flex-flow: column;
    grid-column: 1 / 6;
    ${media.desktop`
      flex-flow: row wrap;
      grid-column: 2 / 10;
    `}
  `,
  Heading: styled(Heading)`
    grid-column: 1 / 6;
    margin-bottom: 4px;
    ${media.desktop`
      width: 100%;
      margin-bottom: 8px
    `}
  `,
  User: styled.p`
    display: flex;
    flex-flow: column;
    font-size: var(--font-size--small);
    font-weight: bold;
    ${media.desktop`
      flex-flow: row wrap;
      font-size: var(--font-size--base);
    `}
  `,
  UserId: styled.span`
    margin-top: 4px;
    color: var(--gray--dark);
    font-size: var(--font-size--small);
    font-weight: normal
    ${media.desktop`
      margin-left: 8px;
    `}
  `,
  Synopsis: styled.p`
    width: 100%;
    margin-top: 8px;
    color: var(--gray--dark);
    line-height: var(--line-height--content);
  `,
  InfoButton: styled.button`
    display: flex;
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 var(--shadow-color);
  `,
  UserPictureWrapper: styled.div`
    grid-column: -2 / -1;
    ${media.desktop`
      grid-column: 1 / 2;
      grid-row: 1;
    `}
  `,
  UserPicture: styled(ContentImage)`
    border-radius: 50%;
  `,
  Subscribe: styled.div`
    display: flex;
    grid-column: 1 / -1;
    flex-flow: column;
    ${media.desktop`
      grid-column: span 3 / -1;
    `}
  `,
  SubscribeButton: styled(PrimaryButton)`
    margin-bottom: 16px;
  `,
  SubscribeInfo: styled.p`
    display: flex;
    margin: 0 auto;
    color: var(--gray--dark);
    font-size: var(--font-size--small);
  `,
  AccessTimeIcon: styled(AccessTimeIcon)`
    width: 20px;
    height: 20px;
    margin-right: 4px;
  `,
};

function ProjectInfo({
  project, ...props
}) {
  const isDesktop = useMedia(mediaQuery.desktop);
  const [isSynopsisVisible, setIsSynopsisVisible] = useState(false);

  return (
    <Styled.Section {...props}>
      <Styled.WideThumbnail
        ratio={isDesktop ? (1440 / 450) : (360 / 180)}
        image={project.wideThumbnail || dummyWideThumbnailImage}
      />
      <Styled.MainGrid>
        <Styled.Text>
          <Styled.Heading>
            {project.title}
          </Styled.Heading>
          <Styled.User>
            {project.user.username}
            <Styled.UserId>
              {`@${project.user.loginId}`}
            </Styled.UserId>
          </Styled.User>
          {project.synopsis && (
            isDesktop ? (
              <Styled.Synopsis>
                {project.synopsis}
              </Styled.Synopsis>
            ) : (
              <>
                <Styled.InfoButton onClick={() => setIsSynopsisVisible(true)}>
                  <InfoIcon />
                </Styled.InfoButton>
                {isSynopsisVisible && (
                  <SynopsisPopup {...project} close={() => setIsSynopsisVisible(false)} />
                )}
              </>
            )
          )}
        </Styled.Text>
        <Styled.UserPictureWrapper>
          <Styled.UserPicture
            ratio={500 / 500}
            image={project.user.picture || dummyUserPicture}
          />
        </Styled.UserPictureWrapper>
        <Styled.Subscribe>
          {project.subscription ? (
            <Styled.SubscribeButton disabled>
              구독중
            </Styled.SubscribeButton>
          ) : (
            <Styled.SubscribeButton as={Link} to="memberships">
              {`${project.subscriptionPrice} PXL로 구독하기`}
            </Styled.SubscribeButton>
          )}
          <Styled.SubscribeInfo>
            <Styled.AccessTimeIcon />
            {project.subscription
              ? `${moment().add(30, 'days').format('ll')}까지`
              : '30일 동안 구독 가능'
            }
          </Styled.SubscribeInfo>
        </Styled.Subscribe>
      </Styled.MainGrid>
    </Styled.Section>
  );
}

ProjectInfo.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    wideThumbnail: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string,

      picture: PropTypes.string,
    }),
  }).isRequired,
};

export default ProjectInfo;
