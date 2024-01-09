'use client'
import React from 'react';
import { CustomChat, FacebookProvider } from 'react-facebook';
import CONFIG from '../config';

const FacebookMsg = () => {
  return (
    <FacebookProvider appId={CONFIG.FACEBOOK_APP_ID} chatSupport>
      <CustomChat pageId={CONFIG.FACEBOOK_PAGE_ID} minimized={true} />
    </FacebookProvider>
  );
};

export default FacebookMsg;
