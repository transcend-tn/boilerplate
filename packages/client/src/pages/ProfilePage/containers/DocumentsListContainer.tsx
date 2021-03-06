import { format } from 'date-fns';
import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { QueryStatus, useMutation, useQuery, useQueryCache } from 'react-query';
import Favoris from '../../../components/FavorisCard';
import { useStoreState } from '../../../hooks/store.hooks';
import { documentsCollab } from '../../../services/collaboration.service';
import { getDocumentsFavoris } from '../../../services/document.service';
import { addFavoriteMutation, removeFavoritetMutation } from '../../../services/favorite.service';
import { getUserByUsername } from '../../../services/user.service';

export interface DocumentsListProps {
  username: string;
}

function DocumentsListContainer(props: DocumentsListProps) {
  const { username } = props;
  const cache = useQueryCache();
  const currentUser = useStoreState((state) => state.user.user);
  const { data: user = {} } = useQuery(['user:getUserByUsername', username], getUserByUsername);
  const { isLoading: d_isLoading, isError: d_isError, data: d_data = [], error: d_error } = useQuery(
    ['collaboration:documentsCollab', user.id],
    documentsCollab,
  );
  const { isError: f_isError, data: f_data = [], error: f_error } = useQuery(
    ['documents:getFavoris', user.id],
    getDocumentsFavoris,
  );

  const [add, { status }] = useMutation(addFavoriteMutation, {
    onSuccess: () => cache.invalidateQueries('documents:getFavoris'),
  });
  const isAddLoading = QueryStatus.Loading === status;
  const [remove, { status: etats }] = useMutation(removeFavoritetMutation, {
    onSuccess: () => cache.invalidateQueries('documents:getFavoris'),
  });
  const isRemoveLoading = QueryStatus.Loading === etats;

  if (d_isError || f_isError) {
    return <span>Error: {d_error || f_error} !</span>;
  }

  return (
    <>
      <ReactPlaceholder ready={!d_isLoading} showLoadingAnimation firstLaunchOnly>
        {d_data.map((doc: any) => {
          return (
            <Favoris
              key={`favoris-${doc.id}`}
              documenTitle={doc.title}
              timeEdit={format(new Date(doc.createdAt), 'd MMMM, HH:mm')}
              id={doc.id}
              active={f_data.map((d: any) => (d !== null ? d._id : -1)).includes(doc.id)}
              onAdd={add}
              isAddLoading={isAddLoading}
              onRemove={remove}
              isRemoveLoading={isRemoveLoading}
              showStar={currentUser.id === user.id}
            />
          );
        })}
      </ReactPlaceholder>
    </>
  );
}

export default DocumentsListContainer;
