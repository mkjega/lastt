import React, { ReactNode } from 'react'
import StreamVideoProvider from '../../../providers/StreamClientProvider'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Let's Meet",
    description: "meeting app",
    icons: "/icons/logo.svg"
  };

const RootLayout = ({children} : {children : ReactNode}) => {
    return (
        <main>
            <StreamVideoProvider>
            {children}
            </StreamVideoProvider>
        </main>
    )
}

export default RootLayout