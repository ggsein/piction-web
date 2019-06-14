import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Input from 'components/atoms/Input';
import PasswordInput from 'components/atoms/Input/PasswordInput';

const Styled = {
  Group: styled.div`
    display: flex;
    flex-flow: column;
  `,
  Label: styled.label`
    margin-bottom: 8px;
    font-size: var(--font-size--small);
  `,
  ErrorMessage: styled.p`
    margin: 8px 0 0;
    color: var(--red);
    font-size: var(--font-size--small);
  `,
};

function InputGroup({
  id, label, errorMessage, className, type, ...props
}) {
  return (
    <Styled.Group className={className}>
      <Styled.Label htmlFor={id}>{label}</Styled.Label>
      {type === 'password'
        ? <PasswordInput id={id} invalid={!!errorMessage} {...props} />
        : <Input id={id} type={type} invalid={!!errorMessage} {...props} />
      }
      {errorMessage && (
        <Styled.ErrorMessage>
          {errorMessage}
        </Styled.ErrorMessage>
      )}
    </Styled.Group>
  );
}

InputGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
};

InputGroup.defaultProps = {
  errorMessage: '',
  className: '',
  type: 'text',
};

export default InputGroup;