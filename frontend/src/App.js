import React from 'react';
import CodeReview from './components/CodeReview';
import GitHubLogin from './components/GitHubLogin';

function App() {
  return (
    <div className="App">
      <h1>Web4AI Project Assistant</h1>
      <GitHubLogin />
      <CodeReview />
    </div>
  );
}

export default App;
