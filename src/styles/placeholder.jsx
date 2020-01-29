import { css } from 'styled-components/macro';

const placeholder = style => css`
  ${({ isPlaceholder }) => isPlaceholder && `
    color: var(--gray--light);
    background-color: var(--gray--light);
    ${style}
  `}
`;

export default placeholder;
