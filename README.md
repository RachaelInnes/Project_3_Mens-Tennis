# Project_3_Mens-Tennis (Group 7)
![image](https://github.com/user-attachments/assets/0f8dab27-5c88-463c-a794-3710b033a97c)

Group included: Rachael Innes, Cathy Matthee, Aria Li and Tsz Hin (Raymond) Tang

The overall objective of this project on Men’s Tennis Grand Slam Winners (1950-2023) is to create an interactive and informative dashboard that provides a comprehensive view of the history and trends in Men’s Tennis Grand Slam victories. By achieving these objectives, the project will contribute to a deeper qppreciation and knowledge of Men’s Tennis Grand Slam history and its key players. 
Through data visualisation and an interactive dashboard this project will:

Enhance Understanding: Offer tennis enthusiasts, analysts, and historians an easy way to explore and understand the data related to Grand Slam winners over the decades.

Identify Patterns and Trends: Highlight historical trends, dominant players, and shifts in the sport over time.
  
Provide Insights: Deliver valuable insights into player performance, the impact of different surfaces, and the evolution of the sport.

Engage Users: Create an engaging and interactive experience that allows users to filter, compare, and analyze data according to their interests.

To use this use this dashboard, the easiest way is to click on the deployed link https://rachaelinnes.github.io/Project_3_Mens-Tennis/. This will take the user to the dashboard where they can commence filtering by "Tournaments" which will display key data about the winner and runner up. There is also a sunburst chart, whereby users can easily see Left and Right Hand players, clicking on any slice will display the players name. There is a bubble chart included that displays information about how many times players have won Grand Slam tournaments.  

In our data visualization project, we prioritized ethical considerations to ensure the integrity and fairness of our work. When undertaking this work we were keen to ensure that we embedded ethical considerations in each part of the process. This is outlined below;

 ### Data Collection:
 We acknowledge that three csv files were used is from a public dataset from Kaggle. The link is included to ensure transparency and ensure that users can verify the data source. The Kaggle source confirms CC0 1.0 Universal licence,and as such, means that creators have waived effectively placed this data in the public domain, and therefore this can be used for the purpose of this project without restriction. 

 ### Data Analysis:
 In using this data for our data visualisation project we were committed to maintaining the accuracy and integrity of the data. We undertook a number of data wrangling techniques to clean the data for usability, whilst ensuring the integrity of the information. This included removing missing values and removing duplicate information (or values) from the csv files.  Data has not been manipulated to skew or misinform users, it has been cleaned for ease of use only. 
  
 ### Data Visualisation (Design):
Any details and information used (such as Tennis players names, winnings, nationality) have been used in a factual way and are displayed in a metadata information table as part of the visualisation dashboard. This information has been used purely for the purpose of visualing the information in a meaningful way and has not been manipulated in a way that would misrepresent them. 
 
 ### Reproducing the extracted json file from PostgresSQL
 - Import the three cvs files from the data folder to the created tables in reverse order in the .sql file or follows:
  1. world_coordinates
  2. countries and then
  3. Mens_Tennis_Grand_Slam_Winner
 - Run the merge query
 - Run the json_agg query that outputs the merged files in json format
 - Then double click the output json cell and select all, copy and paste into a new vs code file and save as .json type.
 - This file was then uploaded to the GitHub repo and the URL was used with D3 library.

Data came from a number of sources, they are:
Kaggle: https://www.kaggle.com/datasets/wonduk/mens-tennis-grand-slam-winner-dataset, this dataset used sraping to collect data from the following sites: https://www.espn.com/tennis/rankings     
https://en.wikipedia.org/wiki https://github.com/popovichN/grand-slam-prize-money

### References Source Code:
We used a number of sources to assist with the code for the visualisation design:

Apache Library: this was a new library used: for lines 41 to 114. A range of sources were used:
 - how to organise the "options" with sample code from:
    - https://echarts.apache.org/en/option.html#series-sunburst
    - https://codepen.io/pen
 - how the basic code structure works https://echarts.apache.org/examples/en/editor.html?c=sunburst-simple
 - chat gpt for help in organising the data into an array of nested objects
Gitlab: utilised code provided as part of coursework 
https://git.bootcampcontent.com/Monash-University/MONU-VIRT-DATA-PT-05-2024-U-LOLC

CoPilot and Chat GPT: used to assist with debugging and validate parts of the code.   

Presentation Deck is [here ](https://www.canva.com/design/DAGPsrphiNA/ZyrlrRktKD0xfIBMYzd4Vg/edit)
