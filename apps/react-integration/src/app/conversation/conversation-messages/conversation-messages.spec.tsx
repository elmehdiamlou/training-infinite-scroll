import { render } from '@testing-library/react';

import ConversationMessages from './conversation-messages';

describe('ConversationMessages', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConversationMessages />);
    expect(baseElement).toBeTruthy();
  });
});
