import { formatDistance } from 'date-fns';
import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import MessageCard from '../../../components/MessageCard';
import { getCommentByDocId } from '../../../services/comment.service';

function MessageListContainer() {
  const { id: docId } = useParams<{ id: string }>();
  const { isLoading, isError, data = [], error } = useQuery(['comments:getbyid', docId], getCommentByDocId);
  if (isError) {
    return <span>Error: {error} !</span>;
  }

  return (
    <>
      <ReactPlaceholder ready={!isLoading} showLoadingAnimation firstLaunchOnly>
        {data.map((msg: any, idx: number) => {
          return (
            <MessageCard
              username={msg.username}
              time={formatDistance(new Date(), new Date(msg.createdAt))}
              body={msg.body}
              key={`message-${idx}`}
            />
          );
        })}
      </ReactPlaceholder>
    </>
  );
}

export default MessageListContainer;
