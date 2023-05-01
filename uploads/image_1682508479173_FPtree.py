# importing module
import pandas as pd
# dataset
dataset = pd.read_csv("Market_Basket.csv")
# printing the shape of the dataset
print(dataset.shape)
# printing the columns and few rows using head
dataset.head()

# importing module
import numpy as np
# you may consider null value through array
# Gather All Items of Each Transactions into Numpy Array
transaction = []
for i in range(0, dataset.shape[0]):
    for j in range(0, dataset.shape[1]):
        transaction.append(dataset.values[i,j])
# converting to numpy array
transaction = np.array(transaction)
print(transaction)

#We can now remove all the null values and print out the top 5 frequently occurring items.
#  Transform Them a Pandas DataFrame
df = pd.DataFrame(transaction, columns=["items"])
# Put 1 to Each Item For Making Countable Table, to be able to perform Group By
df["incident_count"] = 1
#  Delete NaN Items from Dataset
indexNames = df[df['items'] == "nan" ].index
df.drop(indexNames , inplace=True)
# Making a New Appropriate Pandas DataFrame for Visualizations
df_table = df.groupby("items").sum().sort_values("incident_count", ascending=False).reset_index()
#  Initial Visualizations
df_table.head(5).style.background_gradient(cmap='Blues')

# use treemap to visualize the purchased items in more detail using the Plotly module.

# importing required module
import plotly.express as px
# to have a same origin
df_table["all"] = "Top 50 items"
# creating tree map using plotly
fig = px.treemap(df_table.head(50), path=['all', "items"], values='incident_count',
                  color=df_table["incident_count"].head(50), hover_data=['items'],
                  color_continuous_scale='Blues',
                )
# ploting the treemap
print(fig.show())