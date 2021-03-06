import withCenter from '../components/layouts/withCenter';
import withMain from '../components/layouts/withMain';
import Welcome from '../components/Welcome';
import PageIntrouvable from '../pages/PageIntrouvablePage';
import DocumentPage from '../pages/DocumentPage/DocumentPage';
import EditDocumentPage from '../pages/EditDocumentPage/EditDocumentContainer';
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage';
import ForgetPassword from '../pages/ForgetPasswordPage';
import NewDocumentPage from '../pages/NewDocumentPage/NewDocumentPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import PropositionDetailsPage from '../pages/PropositionDetailsPage/PropositionDetailsPage';
import CloneDocumentPage from '../pages/CloneDocumentPage/CloneDocumentPage';
import SearchPage from '../pages/SearchPage/SearchPage';

export interface Route {
  path: string;
  Component: any;
}

const routes: Route[] = [
  {
    path: '/',
    Component: withCenter(Welcome),
  },
  {
    path: '/search/:keyword',
    Component: withMain(SearchPage),
  },
  {
    path: '/forget-password',
    Component: withCenter(ForgetPassword),
  },
  {
    path: '/profile/:id',
    Component: withMain(ProfilePage),
  },
  {
    path: '/profile/:id/edit',
    Component: withMain(EditProfilePage),
  },
  {
    path: '/document/new',
    Component: withMain(NewDocumentPage),
  },
  {
    path: '/document/:id',
    Component: withMain(DocumentPage),
  },
  {
    path: '/document/edit/:id',
    Component: withMain(EditDocumentPage),
  },
  {
    path: '/document/:docId/:histId',
    Component: withMain(CloneDocumentPage),
  },
  {
    path: '/request/detail/:id',
    Component: withMain(PropositionDetailsPage),
  },
  {
    path: '*',
    Component: withCenter(PageIntrouvable),
  },
];

export default routes;
