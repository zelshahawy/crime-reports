from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
app = Flask(__name__)
CORS(app)
CORS(app, origins=["http://localhost:3000"])

# Load the data
crimes_data_2020 = pd.read_csv('midterm_project_NCVS_2020.csv')

# Adjust the columns for binary crime indicators
def adjust_crime_indicators(df: pd.DataFrame) -> pd.DataFrame:
    adjusted_func = lambda x: 'YES' if x == 1 else 'NO'
    df['BROKEN_IN'] = df['BROKEN_IN'].apply(adjusted_func)
    df['VEHICLE_THEFT'] = df['VEHICLE_THEFT'].apply(adjusted_func)
    df['FORCED_SEX'] = df['FORCED_SEX'].apply(adjusted_func)
    return df

all_crime = adjust_crime_indicators(crimes_data_2020.copy())

crime_counts = all_crime.groupby(['BROKEN_IN', 'VEHICLE_THEFT', 'FORCED_SEX']).size()

def filter_and_adjust_age_group(df: pd.DataFrame) -> pd.DataFrame:
    adjusted_func = lambda x: 1 if x == 1 else 0
    filtered_df = df[(df['AGE'] > 6) & (df['AGE'] < 19)].copy()
    filtered_df['BROKEN_IN'] = filtered_df['BROKEN_IN'].apply(adjusted_func)
    filtered_df['VEHICLE_THEFT'] = filtered_df['VEHICLE_THEFT'].apply(adjusted_func)
    filtered_df['FORCED_SEX'] = filtered_df['FORCED_SEX'].apply(adjusted_func)
    filtered_df['TOTAL_CRIME'] = filtered_df['FORCED_SEX'] + filtered_df['VEHICLE_THEFT'] + filtered_df['BROKEN_IN']
    return filtered_df

filtered_by_age_and_adjusted_results = filter_and_adjust_age_group(crimes_data_2020)

# Grouping function based on the provided logic
def filtering_and_grouping(main_dataframe: pd.DataFrame, list_of_columns_of_interest: list, variable: str) -> pd.DataFrame:
    grouped_data_mean = main_dataframe.groupby(variable)[list_of_columns_of_interest].mean()
    return grouped_data_mean

@app.route('/api/crime-data', methods=['GET'])
def get_crime_data():
    # Extract query parameters
    crime_type = request.args.get('crime', '')
    group_by = request.args.get('group_by', '')
    
    # Filter and adjust the data based on crime type (if provided)
    filtered_data = all_crime[all_crime['crime'].str.contains(crime_type, case=False, na=False)] if crime_type else all_crime
    
    # Group and calculate the mean for selected columns if a group_by variable is provided
    if group_by and group_by in filtered_data.columns:
        grouped_data = filtering_and_grouping(filtered_data, ['BROKEN_IN', 'VEHICLE_THEFT', 'FORCED_SEX', 'TOTAL_CRIME'], group_by)
        response = {
            "labels": grouped_data.index.tolist(),
            "values": grouped_data['TOTAL_CRIME'].tolist(),
        }
    else:
        response = {
            "labels": filtered_data['AGE'].tolist(),
            "values": filtered_data['TOTAL_CRIME'].tolist(),
        }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
