NyxChart 📈
NyxChart is a powerful and customizable charting library built for tracking cryptocurrency sentiment, whale activity, and market trends. It provides real-time data visualization with a focus on historical trends and AI-driven sentiment analysis.

![image](https://github.com/user-attachments/assets/f03e0e99-aedc-47ed-adfa-1cd257cd3191)


✨ Features
📈 Technical Analysis Tools – Includes moving averages, RSI, and other key indicators.
🎨 Customizable & Aesthetic UI – Smooth, interactive charts with a dark-mode theme.
⚡ Lightweight & Fast – Optimized for performance while handling large datasets.
🚀 Installation
Step 1: Clone the NyxChart Repository
If you're using this in another project, clone your GitHub repo (or copy the folder manually):

sh
git clone https://github.com/Byte-freq/NyxChart.git
Then navigate into the project:

sh
cd NyxChart
Step 2: Link NyxChart to Your React Project
Since NyxChart isn’t on npm yet, you have two options:

Option 1: Use npm link (Best for Development)
Inside the NyxChart directory, run:

sh
Copy
Edit
npm link
This creates a symbolic link for local development.

Inside your React project directory, run:

sh
Copy
Edit
npm link nyx-chart
Now, your project treats nyx-chart as if it were installed from npm.

Option 2: Install Locally with a File Path
Instead of using npm, you can install NyxChart from your local directory:

sh
npm install ../path/to/NyxChart
or if using yarn:

sh
yarn add file:../path/to/NyxChart
Replace ../path/to/NyxChart with the actual relative path to the folder.

Basic Example
jsx
import React from "react";
import NyxChart from "nyx-chart";

const MyComponent = () => {
  return (
    <div>
      <h2>Crypto Sentiment Chart</h2>
      <NyxChart crypto="bitcoin" timeframe="1d" />
    </div>
  );
};

export default MyComponent;
Props
Prop	Type	Description
crypto	string	Cryptocurrency symbol (e.g., "bitcoin", "ethereum")
timeframe	string	Time interval ("1h", "1d", "1w", "1m")
theme	string	Chart theme ("dark", "light")
📖 Advanced Configuration
NyxChart supports additional customization options such as:

Changing the chart type (candlestick, line, bar, etc.)
Adding multiple datasets for comparison
Adjusting AI sensitivity for sentiment predictions
jsx
Copy
Edit
<NyxChart 
  crypto="ethereum" 
  timeframe="1h" 
  theme="dark"
  showTechnicalIndicators={true}
/>
📡 Data Sources
NyxChart pulls real-time and historical data from:
✅ Social Media Sentiment (Twitter, Reddit, etc.)
✅ On-Chain Whale Transactions
✅ Technical Analysis Indicators
✅ Crypto Market Data APIs

🛠️ Development & Contribution
Want to contribute? Clone the repo and start coding!

sh
git clone https://github.com/Byte-freq/nyxchart.git
cd nyxchart
npm install
npm start
💬 Community & Support
Report issues or request features: [GitHub Issues]
📜 License
NyxChart is open-source under the MIT License.
