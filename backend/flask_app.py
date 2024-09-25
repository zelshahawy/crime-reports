import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-GUI environments

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import matplotlib.pyplot as plt

app = Flask(__name__)

crimes_data_2020 = pd.read_csv('midterm_project_NCVS_2020.csv')

def filter_and_adjust_age_group(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adjusts the crime columns to binary indicators and calculates the total of three crimes.

    Args:
        df (pd.DataFrame): The input DataFrame containing crime data.

    Returns:
        pd.DataFrame: The adjusted DataFrame with binary crime indicators and a total crime column.
    """
    adjusted_func = lambda x: 1 if x == 1 else 0
    filtered_df = df.copy()
    filtered_df['BROKEN_IN'] = filtered_df['BROKEN_IN'].apply(adjusted_func)
    filtered_df['VEHICLE_THEFT'] = filtered_df['VEHICLE_THEFT'].apply(adjusted_func)
    filtered_df['FORCED_SEX'] = filtered_df['FORCED_SEX'].apply(adjusted_func)
    filtered_df['TOTAL_OF_THREE_CRIMES'] = filtered_df['BROKEN_IN'] + filtered_df['FORCED_SEX'] + filtered_df['VEHICLE_THEFT']
    return filtered_df

filtered_by_age_and_adjusted_results = filter_and_adjust_age_group(crimes_data_2020)

def filtering_and_grouping(main_dataframe: pd.DataFrame,
                           list_of_columns_of_interest: list,
                           variable: str) -> pd.DataFrame:
    """
    Groups the DataFrame by a specified variable and calculates the mean for the columns of interest.

    Args:
        main_dataframe (pd.DataFrame): The input DataFrame to be grouped.
        list_of_columns_of_interest (list): The columns for which the mean is calculated.
        variable (str): The column by which to group the DataFrame.

    Returns:
        pd.DataFrame: The grouped DataFrame with mean values.
    """
    grouped_data_mean = main_dataframe.groupby(variable)[list_of_columns_of_interest].mean()
    return grouped_data_mean

@app.route('/api/home', methods=['GET'])
def get_crime_data():
    """
    API endpoint to get crime data based on the specified crime type and grouping variable.

    Query Parameters:
        crime (str): The type of crime to analyze.
        group_by (str): The variable by which to group the data.

    Returns:
        Response: A PNG image of the bar plot or a JSON error message.
    """
    crime_type = request.args.get('crime', '')
    group_by = request.args.get('group_by', '')

    if crime_type not in filtered_by_age_and_adjusted_results.columns:
        return jsonify({"error": "Invalid crime type"}), 400

    grouped_data = filtering_and_grouping(filtered_by_age_and_adjusted_results, [crime_type], group_by)

    fig = grouped_data.plot(kind='bar', y=crime_type, legend=False, title=f'{crime_type} by {group_by}').get_figure()
    plt.xlabel(group_by)
    plt.ylabel(f'{crime_type} AVERAGES')

    img = io.BytesIO()
    fig.savefig(img, format='png')
    img.seek(0)

    plt.close(fig)

    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port=8080)