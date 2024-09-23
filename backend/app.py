import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-GUI environments

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# Load the data
crimes_data_2020 = pd.read_csv('midterm_project_NCVS_2020.csv')

# Adjust the columns for binary crime indicators
all_crime = crimes_data_2020.copy()

def filter_and_adjust_age_group(df: pd.DataFrame) -> pd.DataFrame:
    adjusted_func = lambda x: 1 if x == 1 else 0
    filtered_df = df.copy()
    filtered_df['BROKEN_IN'] = filtered_df['BROKEN_IN'].apply(adjusted_func)
    filtered_df['VEHICLE_THEFT'] = filtered_df['VEHICLE_THEFT'].apply(adjusted_func)
    filtered_df['FORCED_SEX'] = filtered_df['FORCED_SEX'].apply(adjusted_func)
    return filtered_df

filtered_by_age_and_adjusted_results = filter_and_adjust_age_group(crimes_data_2020)

# Grouping function based on the provided logic
def filtering_and_grouping(main_dataframe: pd.DataFrame, list_of_columns_of_interest: list, variable: str) -> pd.DataFrame:
    grouped_data_mean = main_dataframe.groupby(variable)[list_of_columns_of_interest].mean()
    return grouped_data_mean

@app.route('/api/home', methods=['GET'])
def get_crime_data():
    crime_type = request.args.get('crime', '')
    group_by = request.args.get('group_by', 'PRINCIPAL_SEX')

    # Ensure crime_type is a valid column
    if crime_type not in filtered_by_age_and_adjusted_results.columns:
        return jsonify({"error": "Invalid crime type"}), 400

    grouped_data = filtering_and_grouping(filtered_by_age_and_adjusted_results, [crime_type], group_by)

    # Generate the plot using Pandas' built-in plot function
    fig = grouped_data.plot(kind='bar', y=crime_type, legend=False, title=f'{crime_type} by {group_by}').get_figure()
    plt.xlabel(group_by)
    plt.ylabel(f'{crime_type} AVERAGES')

    # Save it to a bytes buffer
    img = io.BytesIO()
    fig.savefig(img, format='png')
    img.seek(0)

    plt.close(fig)  # Close the figure to prevent resource leaks

    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port=8080)
