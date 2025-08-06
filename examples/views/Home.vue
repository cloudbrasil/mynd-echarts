<template>
  <div class="home-page">
    <div class="hero">
      <h1>Welcome to mynd-echarts Testing Interface</h1>
      <p>A comprehensive Vue 3 wrapper for Apache ECharts with full TypeScript support</p>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>🎨 All Chart Types</h3>
        <p>Test all ECharts chart types with randomly generated data and interactive controls</p>
      </div>
      <div class="feature-card">
        <h3>🎯 Real-time Updates</h3>
        <p>See charts update in real-time as you adjust parameters and settings</p>
      </div>
      <div class="feature-card">
        <h3>🌈 Theme Support</h3>
        <p>Switch between multiple themes to see how your charts look in different styles</p>
      </div>
      <div class="feature-card">
        <h3>📱 Responsive Design</h3>
        <p>All charts automatically resize and adapt to different screen sizes</p>
      </div>
    </div>

    <div class="quick-links">
      <h2>Popular Charts</h2>
      <div class="chart-grid">
        <router-link to="/line" class="chart-card">
          <span class="chart-icon">📈</span>
          <span class="chart-name">Line Chart</span>
        </router-link>
        <router-link to="/bar" class="chart-card">
          <span class="chart-icon">📊</span>
          <span class="chart-name">Bar Chart</span>
        </router-link>
        <router-link to="/pie" class="chart-card">
          <span class="chart-icon">🥧</span>
          <span class="chart-name">Pie Chart</span>
        </router-link>
        <router-link to="/scatter" class="chart-card">
          <span class="chart-icon">⚪</span>
          <span class="chart-name">Scatter Chart</span>
        </router-link>
        <router-link to="/radar" class="chart-card">
          <span class="chart-icon">🎯</span>
          <span class="chart-name">Radar Chart</span>
        </router-link>
        <router-link to="/heatmap" class="chart-card">
          <span class="chart-icon">🔥</span>
          <span class="chart-name">Heatmap</span>
        </router-link>
      </div>
    </div>

    <div class="getting-started">
      <h2>Getting Started</h2>
      <div class="code-example">
        <pre><code>import { MyndEcharts } from 'mynd-echarts'

&lt;template&gt;
  &lt;MyndEcharts
    :options="chartOptions"
    :theme="theme"
    :loading="loading"
    @ready="handleReady"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No specific logic needed for home page
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
}

.quick-links {
  margin-bottom: 3rem;
}

.quick-links h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.chart-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: #f0f2ff;
}

.chart-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.chart-name {
  font-weight: 500;
}

.getting-started {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.getting-started h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.code-example {
  background: #f5f7fa;
  padding: 1.5rem;
  border-radius: 4px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.code-example code {
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  color: #303133;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .chart-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>