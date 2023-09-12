import { render } from '@testing-library/react';

import Conversation from './conversation';

describe('Conversation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Conversation />);
    expect(baseElement).toBeTruthy();
  });
});
