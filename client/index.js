import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';

import introspectionQueryResultData from "../type.json";
import Resize from './resize';
import './style/index.scss';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});
const cache = new InMemoryCache({ fragmentMatcher });

// apollo & graphql
const client = new ApolloClient({
  cache
});
const App = () => (
  <ApolloProvider client={client}>
    <Resize />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));