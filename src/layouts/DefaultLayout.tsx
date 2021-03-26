import React, { FC, Suspense, useEffect } from 'react';
import { Switch } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import Routes from 'router/Routes';
import Sidebar from 'components/sidebar/Sidebar';
import * as styles from './DefaultLayout.style';
import AppHeader from 'components/app-header/AppHeader';
import NotificationGroup from 'components/notifications/NotificationGroup';
import ErrorWrapper from 'components/error-wrapper/ErrorWrapper';
import { routes } from 'router/route.config';
import { ContentSpinner } from 'components/spinners';
import { fetchLanguages } from 'services/languages';

const DefaultLayout: FC = () => {

  const layoutMode = useSelector((state: RootState) => state.layout.mode);

  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch])

  return (
    <styles.LayoutWrapper mode={layoutMode} className='u-flex u-flexColumn u-minHeightScreen' id="layout-root">
      <AppHeader />
      <styles.BodyContentArea className='u-flex u-flexGrow'>
        <Sidebar />
        <div className="u-widthFull u-minHeightFull u-backgroundCanvas u-paddingLarge">
          <ErrorWrapper>
            <Suspense fallback={<ContentSpinner />}>
              <Switch>
                <Routes routes={routes} />
              </Switch>
            </Suspense>
          </ErrorWrapper>
        </div>
      </styles.BodyContentArea>
      <NotificationGroup />
    </styles.LayoutWrapper>
  );
}

export default DefaultLayout;