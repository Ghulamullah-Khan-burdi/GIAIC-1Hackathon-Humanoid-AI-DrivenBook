import React from 'react';
import Layout from '@theme/Layout';

function Home() {
  return (
    <Layout
      title="Home"
      description="Humanoid Robotics & Physical AI Book">
      <main>
        <section style={{ padding: '40px 0', textAlign: 'center' }}>
          <h1>Welcome to Humanoid Robotics & Physical AI Book</h1>
          <p>Building Intelligent Robots from Scratch</p>
          <div>
            <a
              href="/docs/module-1-ros2/chapter-1-intro"
              className="button button--secondary button--lg">
              Start Reading 📖
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;