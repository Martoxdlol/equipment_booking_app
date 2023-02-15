import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

import dayjs from 'dayjs'

import 'dayjs/locale/es' // import locale
import NamespaceProvider from "../lib/components/NamespaceProvider";

dayjs.locale('es')

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NamespaceProvider>
        <Component {...pageProps} />
      </NamespaceProvider >
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
