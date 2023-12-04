import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Questions from '../src/components/Questions/Questions'

describe('Question component', () => {
  const question = {
    question_category: 'React',
    question_topic: 'Testing React Components',
    question_text: 'Question Postepd by Community member?',
    comments: ['Great question! I would like to share my experience. Based on what I know ....'],
  };

  test('renders question text and comments', () => {
    const { getByText } = render(<Questions question={question} />);
    expect(getByText(question.question_text)).toBeInTheDocument();
    question.comments.forEach((comment) => {
      expect(getByText(comment)).toBeInTheDocument();
    });
  });

  test('allows user to like a question', () => {
    const handleLikeMock = jest.fn();
    const { getByText } = render(<Questions question={question} onLike={handleLikeMock} />);
    const likeButton = getByText('Like');
    fireEvent.click(likeButton);
    expect(handleLikeMock).toHaveBeenCalledWith(true);
  });

  test('allows user to add a comment', () => {
    const handleCommentSubmitMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <Questions question={question} onCommentSubmit={handleCommentSubmitMock} />
    );
    const commentTextarea = getByLabelText('Leave your comment');
    const submitButton = getByText('Submit');
    const newComment = 'This is a new comment.';
    fireEvent.change(commentTextarea, { target: { value: newComment } });
    fireEvent.click(submitButton);
    expect(handleCommentSubmitMock).toHaveBeenCalledWith(newComment);
  });
});
