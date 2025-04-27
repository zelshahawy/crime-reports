import matplotlib
matplotlib.use('Agg')

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://crime-report-web-app.vercel.app"]}})

crimes_data_2020 = pd.read_csv('NCVS_2020.csv')
all_crime = crimes_data_2020.copy()

def filter_and_adjust_age_group(df: pd.DataFrame) -> pd.DataFrame:
    """
    Filters and adjusts specific columns in the DataFrame to binary values.

    This function takes a DataFrame and applies a transformation to the 'BROKEN_IN',
    'VEHICLE_THEFT', and 'FORCED_SEX' columns. The transformation converts the values
    in these columns to binary values: 1 if the original value is 1, otherwise 0.

    Parameters:
    df (pd.DataFrame): The input DataFrame containing the columns to be adjusted.

    Returns:
    pd.DataFrame: A new DataFrame with the specified columns adjusted to binary values.
    """
    adjusted_func = lambda x: 1 if x == 1 else 0
    filtered_df = df.copy()
    filtered_df['BROKEN_IN'] = filtered_df['BROKEN_IN'].apply(adjusted_func)
    filtered_df['VEHICLE_THEFT'] = filtered_df['VEHICLE_THEFT'].apply(adjusted_func)
    filtered_df['FORCED_SEX'] = filtered_df['FORCED_SEX'].apply(adjusted_func)
    filtered_df['STOLEN'] = filtered_df['STOLEN'].apply(adjusted_func)
    filtered_df['TOTAL_CRIME'] = filtered_df['BROKEN_IN'] + filtered_df['VEHICLE_THEFT'] + filtered_df['FORCED_SEX'] + filtered_df['STOLEN']
    return filtered_df

filtered_by_age_and_adjusted_results = filter_and_adjust_age_group(crimes_data_2020)

def filtering_and_grouping(main_dataframe: pd.DataFrame, list_of_columns_of_interest: list, variable: str) -> pd.DataFrame:
    """
    Groups the DataFrame by a specified variable and calculates the mean of selected columns.

    This function takes a DataFrame and groups it by the specified variable. It then calculates
    the mean for each group for the columns listed in `list_of_columns_of_interest`.

    Parameters:
    main_dataframe (pd.DataFrame): The input DataFrame containing the data to be grouped.
    list_of_columns_of_interest (list): A list of column names for which the mean will be calculated.
    variable (str): The column name by which to group the DataFrame.

    Returns:
    pd.DataFrame: A new DataFrame with the mean values of the specified columns for each group.
    """
    grouped_data_mean = main_dataframe.groupby(variable)[list_of_columns_of_interest].mean()
    return grouped_data_mean

@app.route('/', methods=['GET'])
def get_crime_data():
    """
    Retrieves crime data based on query parameters and returns it as JSON.

    Query Parameters:
    crime (str): The type of crime to analyze.
    group_by (str): The column by which to group the data.

    Returns:
    JSON: The grouped data or an error message.
    """
    crime_type = request.args.get('crime', '')
    group_by = request.args.get('group_by', '')
    
    if crime_type not in filtered_by_age_and_adjusted_results.columns:
        return jsonify({"error": "Invalid crime type"}), 400

    grouped_data = filtering_and_grouping(filtered_by_age_and_adjusted_results, [crime_type], group_by)

    # Convert the grouped DataFrame to a JSON-compatible format
    json_data = {
        "labels": grouped_data.index.tolist(),
        "datasets": [{
            "label": f"{crime_type}_AVERAGES",
            "data": grouped_data[crime_type].tolist(),
            "backgroundColor": "rgba(75, 192, 192, 0.2)",
            "borderColor": "rgba(75, 192, 192, 1)",
            "borderWidth": 1,
        }]
    }
    return jsonify(json_data), 200

if __name__ == "__main__":
    app.run(port=5050, debug=True)
