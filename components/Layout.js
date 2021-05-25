import React from "react";
import Head from "next/head";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
      <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <script src="https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js"></script>
      </Head>

      <Header />
      {children}
    </>
  );
};

export default Layout;